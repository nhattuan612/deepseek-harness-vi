import dictionaries from '../../catalog/vi.json' with { type: 'json' }

export const inject = ['locale']

// DSH 0.1.2 uses legacy keys for the text-size row and session-log action.
const legacyKeys = {
  'settings.theme': {
    'fontSize.title': 'fontSize.text.title',
    'fontSize.description': 'fontSize.text.description',
    'fontSize.increase': 'fontSize.text.increase',
    'fontSize.decrease': 'fontSize.text.decrease',
  },
  'session-log-download': { 'header.action': 'menu.download' },
}

export function apply(ctx) {
  ctx.effect(() => {
    const dispose = [ctx.locale.addLanguage({ id: 'vi', label: 'Tiếng Việt', fallback: 'en' })]
    try {
      for (const [namespace, dictionary] of Object.entries(dictionaries)) {
        const aliases = legacyKeys[namespace]
        const compatible = aliases
          ? { ...dictionary, ...Object.fromEntries(Object.entries(aliases).map(([key, current]) => [key, dictionary[current]])) }
          : dictionary
        dispose.push(ctx.locale.register(namespace, 'vi', compatible))
      }
    } catch (error) {
      for (const release of dispose.reverse()) release()
      throw error
    }
    return () => { for (const release of dispose.reverse()) release() }
  }, 'deepseek-harness-vi: language pack')
}
