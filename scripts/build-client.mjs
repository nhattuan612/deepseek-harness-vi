import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = await readFile(join(root, 'src/client/index.js'), 'utf8')
const dictionaries = JSON.parse(await readFile(join(root, 'catalog/vi.json'), 'utf8'))
const implementation = source
  .replace("import dictionaries from '../../catalog/vi.json' with { type: 'json' }\n\n", '')
  .replace('export const inject =', 'const inject =')
  .replace('export function apply(', 'function apply(')
if (implementation === source || /^\s*(?:import|export)\b/m.test(implementation)) {
  throw new Error('client source changed; update the bundle generator')
}

const bundle = `window.__ModuleLoader__.load({
\tid: "deepseek-harness-vi",
\tfactory: (require) => {
\t\tvar module = { exports: {} };
\t\tvar exports = module.exports;
\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
\t\tconst dictionaries = ${JSON.stringify(dictionaries)};
${implementation.split('\n').map(line => line.trim() ? `\t\t${line}` : '').join('\n')}
\t\texports.apply = apply;
\t\texports.inject = inject;
\t\treturn module.exports;
\t}
});
`
const output = join(root, 'lib/client.js')
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8').catch(() => '') !== bundle) throw new Error('lib/client.js is stale; run bun run build:client')
} else {
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, bundle)
}
