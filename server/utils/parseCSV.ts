/**
 * Minimal CSV parser that handles quoted fields (including commas and escaped
 * double-quotes inside them). Supports the standard RFC 4180 quoting style
 * used by the PRD-015 exports: "" inside a quoted field = literal ".
 */
export function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')

  const headers = splitCSVLine(lines[0])
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = splitCSVLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = values[idx]?.trim() ?? ''
    })
    rows.push(row)
  }

  return rows
}

function splitCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const ch = line[i]

    if (inQuotes) {
      if (ch === '"') {
        // Escaped quote: "" → "
        if (line[i + 1] === '"') {
          current += '"'
          i += 2
        } else {
          // Closing quote
          inQuotes = false
          i++
        }
      } else {
        current += ch
        i++
      }
    } else {
      if (ch === '"') {
        inQuotes = true
        i++
      } else if (ch === ',') {
        fields.push(current)
        current = ''
        i++
      } else {
        current += ch
        i++
      }
    }
  }

  fields.push(current)
  return fields
}
