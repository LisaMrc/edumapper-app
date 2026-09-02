import { loadPrograms } from '../utils/programs'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const q = String(query.q ?? '').toLowerCase().trim()

  const all = loadPrograms()

  if (!q) return all.slice(0, 50)

  const terms = q.split(/\s+/).filter(Boolean)

  const results = all.filter((program) => {
    const haystack = [
      program.title,
      program.short_title,
      program.field,
      program.diploma,
      program.city,
      program.school_title,
      ...program.variants.map((v) => v.title),
    ]
      .join(' ')
      .toLowerCase()

    return terms.every((term) => haystack.includes(term))
  })

  return results.slice(0, 100)
})
