import { readdir, readFile, writeFile } from 'node:fs/promises'

const sourceDir = new URL('../catalog/source/', import.meta.url)
const viDir = new URL('../catalog/vi/', import.meta.url)
const sources = (await readdir(sourceDir)).filter(file => file.endsWith('.json')).sort()
const dictionaries = {}
let keyCount = 0
const placeholders = value => [...value.matchAll(/\{[\w.-]+\}/g)].map(match => match[0]).sort()

for (const file of sources) {
  const source = JSON.parse(await readFile(new URL(file, sourceDir), 'utf8'))
  const viFile = new URL(file, viDir)
  const vi = JSON.parse(await readFile(viFile, 'utf8'))
  const keys = Object.keys(source.en).sort()
  if (JSON.stringify(keys) !== JSON.stringify(Object.keys(source.zh).sort())) {
    throw new Error(`${file}: upstream English/Chinese key sets differ`)
  }
  if (JSON.stringify(keys) !== JSON.stringify(Object.keys(vi).sort())) {
    throw new Error(`${file}: Vietnamese keys do not exactly match upstream`)
  }
  for (const key of keys) {
    if (typeof vi[key] !== 'string' || (!vi[key].trim() && source.en[key].trim())) throw new Error(`${file}:${key}: empty translation`)
    if (JSON.stringify(placeholders(source.en[key])) !== JSON.stringify(placeholders(vi[key]))) {
      throw new Error(`${file}:${key}: placeholder mismatch`)
    }
  }
  const namespace = file.slice(0, -'.json'.length).replaceAll('__', '/')
  dictionaries[namespace] = Object.fromEntries(keys.map(key => [key, vi[key]]))
  keyCount += keys.length
}

const output = `${JSON.stringify(dictionaries, null, 2)}\n`
const outputPath = new URL('../catalog/vi.json', import.meta.url)
if (process.argv.includes('--check')) {
  if (await readFile(outputPath, 'utf8').catch(() => '') !== output) throw new Error('catalog/vi.json is stale; run bun run build:catalog')
} else {
  await writeFile(outputPath, output)
}
console.log(`OK: ${Object.keys(dictionaries).length} namespaces, ${keyCount} translated strings`)
