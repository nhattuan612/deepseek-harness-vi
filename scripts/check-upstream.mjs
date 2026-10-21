import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const repo = resolve(new URL('..', import.meta.url).pathname)
const sourceMap = JSON.parse(await readFile(join(repo, 'catalog/source-map.json'), 'utf8'))
const registrationSnapshot = JSON.parse(await readFile(join(repo, 'catalog/registrations.json'), 'utf8'))
const temporary = process.argv[2] ? undefined : await mkdtemp(join(tmpdir(), 'dsh-upstream-'))
const upstream = resolve(process.argv[2] ?? join(temporary, 'deepseek-harness'))

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed`)
}

function walk(path) {
  return readdir(path, { withFileTypes: true }).then(entries => Promise.all(entries.map(entry => {
    const child = join(path, entry.name)
    return entry.isDirectory() ? walk(child) : [child]
  }))).then(groups => groups.flat())
}

function normalize(value) { return value.trim().replace(/\s+/g, ' ') }

function extractCalls(text) {
  const found = []
  const marker = 'locale.register('
  let position = 0
  while ((position = text.indexOf(marker, position)) >= 0) {
    let index = position + marker.length, depth = 1, quote = '', escaped = false
    const start = index
    for (; index < text.length && depth; index++) {
      const char = text[index]
      if (quote) {
        if (escaped) escaped = false
        else if (char === '\\') escaped = true
        else if (char === quote) quote = ''
      } else if (char === "'" || char === '"' || char === '`') quote = char
      else if (char === '(') depth++
      else if (char === ')') depth--
    }
    if (depth === 0) found.push(normalize(text.slice(start, index - 1)))
    position = index
  }
  return found
}

function decodeSingleQuoted(value) {
  return value.replace(/\\'/g, "'").replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\\\/g, '\\')
}

function inlineLocale(text, locale) {
  const marker = `['${locale}', {`
  const start = text.indexOf(marker)
  if (start < 0) throw new Error(`inline ${locale} dictionary not found`)
  const objectStart = text.indexOf('{', start)
  let depth = 1, quote = '', escaped = false, end = objectStart + 1
  for (; end < text.length && depth; end++) {
    const char = text[end]
    if (quote) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === quote) quote = ''
    } else if (char === "'" || char === '"' || char === '`') quote = char
    else if (char === '{') depth++
    else if (char === '}') depth--
  }
  const body = text.slice(objectStart + 1, end - 1)
  const result = Object.fromEntries([...body.matchAll(/'((?:\\.|[^'\\])*)'\s*:\s*'((?:\\.|[^'\\])*)'/g)]
    .map(match => [decodeSingleQuoted(match[1]), decodeSingleQuoted(match[2])]))
  if (!Object.keys(result).length) throw new Error(`inline ${locale} dictionary is empty or unsupported`)
  return result
}

function same(a, b) { return JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort()) }

try {
  if (!process.argv[2]) run('git', ['clone', '--depth', '1', 'https://github.com/deepseek-ai/deepseek-harness.git', upstream], dirname(upstream))
  const base = join(upstream, 'packages')
  const clientFiles = (await walk(base)).filter(path => path.includes('/src/client/') && /\.tsx?$/.test(path) && !path.includes('/tests/'))
  const actualCalls = []
  for (const file of clientFiles) {
    const relative = file.slice(upstream.length + 1)
    const text = await readFile(file, 'utf8')
    actualCalls.push(...extractCalls(text).map(call => `${relative}::${call}`))
  }
  const expectedCalls = registrationSnapshot.map(item => `${item.file}::${normalize(item.call)}`)
  const missingCalls = expectedCalls.filter(call => !actualCalls.includes(call))
  const newCalls = actualCalls.filter(call => !expectedCalls.includes(call))
  if (missingCalls.length || newCalls.length) {
    throw new Error(`upstream locale registrations changed (${missingCalls.length} removed/changed, ${newCalls.length} new); update catalog and translations`)
  }

  const failures = []
  for (const [namespace, metadata] of Object.entries(sourceMap)) {
    const snapshotFile = join(repo, 'catalog/source', `${namespace.replaceAll('/', '__')}.json`)
    const snapshot = JSON.parse(await readFile(snapshotFile, 'utf8'))
    if (metadata.namespaceRef.kind === 'local') {
      const registrationText = await readFile(join(upstream, metadata.namespaceRef.file), 'utf8')
      const pattern = new RegExp(`(?:const|let)\\s+${metadata.namespaceRef.name}\\s*=\\s*['"]([^'"]+)['"]`)
      if (pattern.exec(registrationText)?.[1] !== namespace) failures.push(`${namespace}: namespace id changed`)
    } else if (metadata.namespaceRef.kind === 'import') {
      const file = pathToFileURL(join(upstream, metadata.namespaceRef.file)).href
      const module = await import(`${file}?locale-check=${encodeURIComponent(namespace)}`)
      if (module[metadata.namespaceRef.name] !== namespace) failures.push(`${namespace}: namespace id changed`)
    }

    let en, zh
    if (metadata.exports.en === 'inline') {
      const text = await readFile(join(upstream, metadata.registration), 'utf8')
      en = inlineLocale(text, 'en')
      zh = inlineLocale(text, 'zh')
    } else {
      const enFile = pathToFileURL(join(upstream, metadata.sources.en)).href
      const zhFile = pathToFileURL(join(upstream, metadata.sources.zh)).href
      const enModule = await import(`${enFile}?locale-check=${encodeURIComponent(namespace)}`)
      const zhModule = metadata.sources.en === metadata.sources.zh ? enModule : await import(`${zhFile}?locale-check=${encodeURIComponent(namespace)}`)
      en = enModule[metadata.exports.en]
      zh = zhModule[metadata.exports.zh]
    }
    if (!en || !zh || !same(en, snapshot.en) || !same(zh, snapshot.zh)) failures.push(`${namespace}: upstream keys or source text changed`)
  }
  if (failures.length) throw new Error(`upstream locale drift detected:\n- ${failures.join('\n- ')}`)

  const head = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: upstream, encoding: 'utf8' }).stdout.trim()
  console.log(`OK: ${Object.keys(sourceMap).length} namespaces match DeepSeek Harness ${head}`)
} finally {
  if (temporary) await rm(temporary, { recursive: true, force: true })
}
