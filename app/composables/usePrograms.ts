import type { EduGeneric } from '../types/programs'

export type SortKey = 'alpha' | 'variants' | 'diploma'

const SORT_LABELS: Record<SortKey, string> = {
  alpha:    'A → Z',
  variants: 'Variantes',
  diploma:  'Diplôme',
}

export const SORT_OPTIONS = (Object.keys(SORT_LABELS) as SortKey[]).map((key) => ({
  key,
  label: SORT_LABELS[key],
}))

function sortPrograms(list: EduGeneric[], key: SortKey): EduGeneric[] {
  const sorted = [...list]
  switch (key) {
    case 'alpha':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'fr'))
    case 'variants':
      return sorted.sort((a, b) => b.variants.length - a.variants.length)
    case 'diploma':
      return sorted.sort((a, b) => a.diploma.localeCompare(b.diploma, 'fr') || a.title.localeCompare(b.title, 'fr'))
    default:
      return sorted
  }
}

export function usePrograms() {
  const query = ref('')
  const debouncedQuery = ref('')
  const sortKey = ref<SortKey>('alpha')
  const rawPrograms = ref<EduGeneric[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  const programs = computed(() => sortPrograms(rawPrograms.value, sortKey.value))

  // Debounce: wait 250ms after last keystroke before fetching
  let timer: ReturnType<typeof setTimeout>
  watch(query, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedQuery.value = val
    }, 250)
  })

  watch(debouncedQuery, async (q) => {
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<EduGeneric[]>('/api/programs', {
        query: { q },
      })
      rawPrograms.value = data
    } catch {
      error.value = 'Impossible de charger les formations. Réessaie.'
      rawPrograms.value = []
    } finally {
      pending.value = false
    }
  }, { immediate: true })

  return { query, programs, sortKey, pending, error }
}
