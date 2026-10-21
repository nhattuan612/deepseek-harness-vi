import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { apply as applyHost } from '../index.js'
import { runInNewContext } from 'node:vm'
import dictionaries from '../catalog/vi.json' with { type: 'json' }

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
assert.ok(manifest.files.includes('cordis.patch.yml'))
assert.equal(manifest.exports['./cordis.patch.yml'], './cordis.patch.yml')
assert.match(await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8'), /name: deepseek-harness-vi/)
assert.doesNotThrow(() => applyHost({}))
const registrations = []
runInNewContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'), {
  window: { __ModuleLoader__: { load: registration => registrations.push(registration) } },
})
assert.equal(registrations.length, 1)
assert.equal(registrations[0].id, 'deepseek-harness-vi')
const { apply } = registrations[0].factory(() => { throw new Error('unexpected import') })

function harness(failAt = Infinity) {
  const registered = []
  let released = 0
  const ctx = {
    effect(run) { this.dispose = run() },
    locale: {
      addLanguage(language) {
        assert.equal(JSON.stringify(language), JSON.stringify({ id: 'vi', label: 'Tiếng Việt', fallback: 'en' }))
        return () => { released++ }
      },
      register(namespace, locale, dictionary) {
        if (registered.length === failAt) throw new Error('registration failed')
        assert.equal(locale, 'vi')
        assert.equal(JSON.stringify(dictionary), JSON.stringify(dictionaries[namespace]))
        registered.push(namespace)
        return () => { released++ }
      },
    },
  }
  return { ctx, registered, get released() { return released } }
}

const success = harness()
apply(success.ctx)
assert.deepEqual(new Set(success.registered), new Set(Object.keys(dictionaries)))
assert.equal(success.registered.length, Object.keys(dictionaries).length)
success.ctx.dispose()
assert.equal(success.released, Object.keys(dictionaries).length + 1)

const failure = harness(3)
assert.throws(() => apply(failure.ctx), /registration failed/)
assert.equal(failure.released, 4)
console.log(`OK: plugin lifecycle registers and rolls back ${Object.keys(dictionaries).length} dictionaries`)
