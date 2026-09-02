import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseCSV } from './parseCSV'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VariantAxes {
  language: 'en' | 'it' | 'fr' | null
  apprenticeship: boolean
  track: string | null
  campus: string | null // resolved school short_title
}

export interface EduVariant {
  program_id: string
  short_title: string
  title: string
  school_id: string
  school_title: string
  city: string
  axes: VariantAxes
}

export interface EduGeneric {
  program_id: string
  short_title: string
  title: string
  diploma: string
  field: string
  city: string
  school_id: string
  school_title: string
  school_group: string
  variants: EduVariant[]
}

// ---------------------------------------------------------------------------
// School index
// ---------------------------------------------------------------------------

interface SchoolInfo { title: string; city: string; parent_school_id: string }

function loadSchools(): Map<string, SchoolInfo> {
  const raw = readFileSync(
    resolve(process.cwd(), 'PRD-015/edu_school.csv'),
    'utf-8',
  )
  const rows = parseCSV(raw)
  const map = new Map<string, SchoolInfo>()
  for (const row of rows) {
    if (row.school_id) {
      map.set(row.school_id, {
        title: row.short_title,
        city: row.city,
        parent_school_id: row.parent_school_id,
      })
    }
  }
  return map
}

function resolveSchoolGroup(school_id: string, schools: Map<string, SchoolInfo>): string {
  const school = schools.get(school_id)
  if (!school) return ''
  if (school.parent_school_id) {
    return schools.get(school.parent_school_id)?.title ?? school.title
  }
  return school.title
}

// ---------------------------------------------------------------------------
// Language normalisation
// ---------------------------------------------------------------------------

const LANG_EN = new Set(['en', 'english', 'anglais', 'eng'])
const LANG_IT = new Set(['it', 'italian', 'italien', 'italiano'])
const LANG_FR = new Set(['fr', 'french', 'français', 'francais'])

function normalizeLanguage(raw: unknown): 'en' | 'it' | 'fr' | null {
  if (!raw) return null
  const v = String(raw).toLowerCase().trim()
  if (LANG_EN.has(v)) return 'en'
  if (LANG_IT.has(v)) return 'it'
  if (LANG_FR.has(v)) return 'fr'
  return null
}

// ---------------------------------------------------------------------------
// Apprenticeship normalisation
// ---------------------------------------------------------------------------

const TRUTHY = new Set(['true', '1', 'oui', 'yes', 'o'])

function normalizeApprenticeship(raw: unknown): boolean {
  if (raw === true || raw === 1) return true
  if (!raw) return false
  return TRUTHY.has(String(raw).toLowerCase().trim())
}

// ---------------------------------------------------------------------------
// Parse variants JSON safely
// ---------------------------------------------------------------------------

function parseVariants(raw: string): VariantAxes {
  let obj: Record<string, unknown> = {}
  try {
    if (raw) obj = JSON.parse(raw)
  } catch {
    // malformed JSON → treat as empty
  }

  return {
    language: normalizeLanguage(obj.language),
    apprenticeship: normalizeApprenticeship(obj.apprenticeship),
    track: obj.track ? String(obj.track).trim() : null,
    campus: obj.school_id ? String(obj.school_id).trim() : null,
  }
}

// ---------------------------------------------------------------------------
// Main loader — cached after first call
// ---------------------------------------------------------------------------

let cache: EduGeneric[] | null = null

export function loadPrograms(): EduGeneric[] {
  if (cache) return cache

  const schools = loadSchools()

  const raw = readFileSync(
    resolve(process.cwd(), 'PRD-015/edu_program.csv'),
    'utf-8',
  )
  const rows = parseCSV(raw)

  // 1. Deduplicate on program_id — keep first occurrence
  const seen = new Set<string>()
  const unique = rows.filter((r) => {
    if (!r.program_id || seen.has(r.program_id)) return false
    seen.add(r.program_id)
    return true
  })

  // 2. Build a quick id → row index for parent resolution
  const byId = new Map(unique.map((r) => [r.program_id, r]))

  // 3. Separate generics and variants
  const generics: EduGeneric[] = []
  const variantRows: typeof unique = []

  for (const row of unique) {
    if (!row.parent_program_id) {
      generics.push({
        program_id: row.program_id,
        short_title: row.short_title,
        title: row.title,
        diploma: row.diploma,
        field: row.field,
        city: schools.get(row.school_id)?.city ?? row.city,
        school_id: row.school_id,
        school_title: schools.get(row.school_id)?.title ?? row.school_id,
        school_group: resolveSchoolGroup(row.school_id, schools),
        variants: [],
      })
    } else {
      variantRows.push(row)
    }
  }

  // 4. Index generics for fast lookup
  const genericIndex = new Map(generics.map((g) => [g.program_id, g]))

  // 5. Attach variants — orphans (broken parent ref) become standalone generics
  for (const row of variantRows) {
    const parent = genericIndex.get(row.parent_program_id)

    const axes = parseVariants(row.variants)

    // Resolve campus school_id from axes to a readable name
    if (axes.campus) {
      axes.campus = schools.get(axes.campus)?.title ?? axes.campus
    }

    const schoolInfo = schools.get(row.school_id)

    if (parent) {
      parent.variants.push({
        program_id: row.program_id,
        short_title: row.short_title,
        title: row.title,
        school_id: row.school_id,
        school_title: schoolInfo?.title ?? row.school_id,
        city: schoolInfo?.city ?? '',
        axes,
      })
    } else {
      // Orphan: display as standalone generic (parent_program_id intact in
      // original data, we just can't link it — treated as its own card)
      generics.push({
        program_id: row.program_id,
        short_title: row.short_title,
        title: row.title,
        diploma: row.diploma,
        field: row.field,
        city: schoolInfo?.city ?? row.city,
        school_id: row.school_id,
        school_title: schoolInfo?.title ?? row.school_id,
        school_group: resolveSchoolGroup(row.school_id, schools),
        variants: [],
      })
    }
  }

  cache = generics
  return cache
}
