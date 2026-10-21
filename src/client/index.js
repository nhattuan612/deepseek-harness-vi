import dictionaries from '../../catalog/vi.json' with { type: 'json' }

export const inject = ['locale']

export function apply(ctx) {
  ctx.effect(() => {
    const dispose = [ctx.locale.addLanguage({ id: 'vi', label: 'Tiếng Việt', fallback: 'en' })]
    try {
      for (const [namespace, dictionary] of Object.entries(dictionaries)) {
        dispose.push(ctx.locale.register(namespace, 'vi', dictionary))
      }
    } catch (error) {
      for (const release of dispose.reverse()) release()
      throw error
    }
    return () => { for (const release of dispose.reverse()) release() }
  }, 'deepseek-harness-vi: language pack')
}
