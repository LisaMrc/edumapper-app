import type { EduGeneric } from '../../server/utils/programs'

export function usePrograms() {
  const query = ref('')
  const debouncedQuery = ref('')
  const programs = ref<EduGeneric[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

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
      programs.value = data
    } catch {
      error.value = 'Impossible de charger les formations. Réessaie.'
      programs.value = []
    } finally {
      pending.value = false
    }
  }, { immediate: true })

  return { query, programs, pending, error }
}
