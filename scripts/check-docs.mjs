import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const upstream = resolve(process.argv[2] ?? join(repo, '..', 'deepseek-harness-upstream'))
const manifestPath = join(repo, 'docs', 'source-manifest.json')
const write = process.argv.includes('--write')

async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => {
    const child = join(path, entry.name)
    return entry.isDirectory() ? walk(child) : [child]
  }))).flat()
}

function hash(text) { return createHash('sha256').update(text).digest('hex') }

function codeBlocks(text) {
  const blocks = []
  let marker, block
  for (const line of text.split(/\r?\n/)) {
    if (marker === undefined) {
      const open = /^\s*(`{3,}|~{3,})/.exec(line)
      if (open) { marker = open[1]; block = [line] }
    } else {
      block.push(line)
      if (new RegExp(`^\\s*${marker[0]}{${marker.length},}\\s*$`).test(line)) {
        blocks.push(block.join('\n'))
        marker = undefined
      }
    }
  }
  if (marker !== undefined) throw new Error('unclosed Markdown code fence')
  return blocks
}

function prose(text) {
  let fenced = false
  return text.split(/\r?\n/).filter(line => {
    const fence = /^\s*(`{3,}|~{3,})/.exec(line)
    if (fence) { fenced = !fenced; return false }
    return !fenced
  }).join('\n')
}

const sourceDocs = (await walk(join(upstream, 'docs', 'user')))
  .filter(path => path.endsWith('.md') && !path.endsWith('.zh.md'))
  .sort()
const entries = []
for (const sourcePath of sourceDocs) {
  const source = sourcePath.slice(upstream.length + 1).split(sep).join('/')
  const relative = source.slice('docs/'.length).replace(/\.md$/, '.vi.md')
  entries.push({ source, target: `docs/vi/${relative}`, sha256: hash(await readFile(sourcePath)) })
}
const cliSource = join(upstream, 'apps', 'cli', 'src', 'args.ts')
const cliHash = hash(await readFile(cliSource))

if (write) {
  for (const entry of entries) await readFile(join(repo, entry.target))
  await readFile(join(repo, 'docs', 'vi', 'cli.md'))
  await writeFile(manifestPath, `${JSON.stringify({ cliSource: 'apps/cli/src/args.ts', cliSha256: cliHash, files: entries }, null, 2)}\n`)
  console.log(`Recorded ${entries.length} source guides and CLI help source.`)
} else {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const failures = []
  if (manifest.cliSource !== 'apps/cli/src/args.ts' || manifest.cliSha256 !== cliHash) failures.push('CLI help source changed; review docs/vi/cli.md and update the manifest')
  if (JSON.stringify(manifest.files.map(item => item.source)) !== JSON.stringify(entries.map(item => item.source))) failures.push('upstream user-guide file set changed; translate new guides and update the manifest')
  for (const [index, entry] of entries.entries()) {
    const recorded = manifest.files[index]
    if (recorded?.sha256 !== entry.sha256) failures.push(`${entry.source}: upstream guide changed; update its translation and manifest`)
    try {
      const sourceText = await readFile(join(upstream, entry.source), 'utf8')
      const targetPath = join(repo, entry.target)
      const targetText = await readFile(targetPath, 'utf8')
      if (JSON.stringify(codeBlocks(sourceText)) !== JSON.stringify(codeBlocks(targetText))) failures.push(`${entry.target}: code fences differ from upstream`)
      const headings = text => [...text.matchAll(/^\s*(#{1,6})\s/gm)].map(match => match[1].length)
      if (JSON.stringify(headings(prose(sourceText))) !== JSON.stringify(headings(prose(targetText)))) failures.push(`${entry.target}: heading structure differs from upstream`)
      for (const [, destination] of prose(targetText).matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
        if (/^(?:https?:|mailto:|#)/i.test(destination)) continue
        const path = destination.split(/[?#]/, 1)[0]
        const target = resolve(dirname(targetPath), decodeURIComponent(path))
        if (path.endsWith('.md') && !path.endsWith('.vi.md')) failures.push(`${entry.target}: local documentation link is not Vietnamese: ${destination}`)
        try { await readFile(target) } catch { failures.push(`${entry.target}: broken local link ${destination}`) }
      }
    } catch (error) { failures.push(`${entry.target}: ${error.code === 'ENOENT' ? 'missing translation' : String(error)}`) }
  }
  if (failures.length) throw new Error(failures.join('\n'))
  console.log(`OK: ${entries.length} translated guides and CLI guide match upstream sources.`)
}
