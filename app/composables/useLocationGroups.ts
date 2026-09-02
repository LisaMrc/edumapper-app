import type { EduGeneric } from '../types/programs'

export function useLocationGroups(program: MaybeRef<EduGeneric>) {
  return computed(() => {
    const p = toValue(program)
    const map = new Map<string, Set<string>>()

    const add = (group: string, city: string) => {
      if (!group) return
      if (!map.has(group)) map.set(group, new Set())
      if (city) map.get(group)!.add(city)
    }

    add(p.school_group, p.city)
    for (const v of p.variants) add(v.school_group, v.city)

    return [...map.entries()].map(([group, cities]) => ({
      group,
      cities: [...cities],
    }))
  })
}
