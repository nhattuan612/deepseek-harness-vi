import assert from 'node:assert/strict'
import { apply } from '../src/client/index.js'
import dictionaries from '../catalog/vi.json' with { type: 'json' }

function harness(failAt = Infinity) {
  const registered = []
  let released = 0
  const ctx = {
    effect(run) { this.dispose = run() },
    locale: {
      addLanguage(language) {
        assert.deepEqual(language, { id: 'vi', label: 'Tiếng Việt', fallback: 'en' })
        return () => { released++ }
      },
      register(namespace, locale, dictionary) {
        if (registered.length === failAt) throw new Error('registration failed')
        assert.equal(locale, 'vi')
        assert.deepEqual(dictionary, dictionaries[namespace])
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
