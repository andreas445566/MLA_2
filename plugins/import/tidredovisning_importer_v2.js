// SPDX-FileCopyrightText: 2024 Skatteverket - Swedish Tax Agency
//
// SPDX-License-Identifier: EUPL-1.2

function global_tidredovisning_import(csvfile) {
  const result = {
    Entities: [],
    Links: [],
    Events: [],
    ErrorMessage: ""
  }

  const lines = csvfile.split('\n').map(line => line.trim()).filter(line => line)

  if (lines.length < 2) {
    result.ErrorMessage = "CSV-filen måste innehålla minst en header-rad och en datarad"
    return result
  }

  const headerLine = lines[0]
  const countDelimiter = (line, delimiter) => line.split(delimiter).length
  const delimiterCandidates = [',', ';', '\t']
  const delimiter = delimiterCandidates.reduce((best, current) =>
    countDelimiter(headerLine, current) > countDelimiter(headerLine, best) ? current : best
  )

  const splitLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }
  const headers = splitLine(headerLine)

  const normalizeHeader = (value) => value
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()

  const normalizedHeaders = headers.map(normalizeHeader)
  const findHeaderIndex = (name) => normalizedHeaders.indexOf(name.toLowerCase())

  const handelseE3_idx = findHeaderIndex('handelsee3')
  const handelseE4_idx = findHeaderIndex('handelsee4')
  const handelseE7_idx = findHeaderIndex('handelsee7')
  const handelseE5_idx = findHeaderIndex('handelsee5')
  const handelseE6_idx = findHeaderIndex('handelsee6')
  const dateFrom_idx = findHeaderIndex('datefrom')
  const timeFrom_idx = findHeaderIndex('timefrom')
  const dateTo_idx = findHeaderIndex('dateto')
  const timeTo_idx = findHeaderIndex('timeto')
  const tidpunkter_idx = findHeaderIndex('tidpunkter')

  if (
    handelseE3_idx === -1 ||
    handelseE4_idx === -1 ||
    handelseE7_idx === -1 ||
    handelseE5_idx === -1 ||
    handelseE6_idx === -1 ||
    (tidpunkter_idx === -1 &&
      (dateFrom_idx === -1 ||
        timeFrom_idx === -1 ||
        dateTo_idx === -1 ||
        timeTo_idx === -1))
  ) {
    result.ErrorMessage = "CSV-filen måste innehålla kolumner: handelseE3, handelseE4, handelseE7, handelseE5, handelseE6 och antingen Tidpunkter eller DateFrom, TimeFrom, DateTo, TimeTo"
    return result
  }

  const parseBoolean = (value) => {
    const normalized = String(value || '').trim().toLowerCase()
    return normalized === 'true' || normalized === '1' || normalized === 'ja' || normalized === 'yes'
  }

  const toIsoFromDateTime = (dateValue, timeValue) => {
    const rawDate = (dateValue || '').trim()
    const rawTime = (timeValue || '').trim()
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(rawDate)) {
      return undefined
    }

    let hours = 0
    let minutes = 0
    if (/^[0-9]{2}:[0-9]{2}$/.test(rawTime)) {
      hours = Number(rawTime.slice(0, 2))
      minutes = Number(rawTime.slice(3, 5))
    }

    const [yearPart, monthPart, dayPart] = rawDate.split('-')
    const year = Number(yearPart)
    const month = Number(monthPart) - 1
    const day = Number(dayPart)

    const dt = new Date(year, month, day, hours, minutes)
    return isNaN(dt.getTime()) ? undefined : dt.toISOString()
  }

  const parseTidpunkter = (value) => {
    const raw = String(value || '').trim()
    if (!raw) return []
    const tokens = raw
      .split(/[;,]/)
      .map(part => part.trim())
      .filter(Boolean)

    const segments = []
    for (let i = 0; i + 3 < tokens.length; i += 4) {
      segments.push(tokens.slice(i, i + 4))
    }

    return segments
      .map(parts => {
        const fromIso = toIsoFromDateTime(parts[0], parts[1])
        const toIso = toIsoFromDateTime(parts[2], parts[3])
        if (!fromIso) return null
        return { fromIso, toIso }
      })
      .filter(Boolean)
  }

  const extractTidpunkter = (value) => {
    const raw = String(value || '')
    const regex = /(\d{4}-\d{2}-\d{2})\s*[;]\s*(\d{2}:\d{2})\s*[;]\s*(\d{4}-\d{2}-\d{2})\s*[;]\s*(\d{2}:\d{2})/g
    const ranges = []
    let match
    while ((match = regex.exec(raw)) !== null) {
      const fromIso = toIsoFromDateTime(match[1], match[2])
      const toIso = toIsoFromDateTime(match[3], match[4])
      if (fromIso) {
        ranges.push({ fromIso, toIso })
      }
    }

    return ranges
  }

  for (let i = 1; i < lines.length; i++) {
    let values = splitLine(lines[i])

    if (tidpunkter_idx >= 0 && values.length > headers.length) {
      const mergedTidpunkter = values.slice(tidpunkter_idx).join(',')
      values = [...values.slice(0, tidpunkter_idx), mergedTidpunkter]
    }

    if (tidpunkter_idx >= 0 && handelseE6_idx >= 0) {
      const tidpunkterValue = String(values[tidpunkter_idx] || '').trim()
      const e6Value = String(values[handelseE6_idx] || '').trim()
      const looksLikeTidpunkter = /\d{4}-\d{2}-\d{2}\s*;\s*\d{2}:\d{2}/.test(e6Value)
      if (!tidpunkterValue && looksLikeTidpunkter) {
        values[tidpunkter_idx] = e6Value
        values[handelseE6_idx] = ''
      }
    }

    if (values.length < Math.max(handelseE3_idx, handelseE4_idx, handelseE7_idx, handelseE5_idx, handelseE6_idx, dateFrom_idx, timeFrom_idx, dateTo_idx, timeTo_idx) + 1) {
      continue
    }

    let ranges = tidpunkter_idx >= 0
      ? (parseTidpunkter(values[tidpunkter_idx]) || []).length
        ? parseTidpunkter(values[tidpunkter_idx])
        : extractTidpunkter(values[tidpunkter_idx])
      : [{
        fromIso: toIsoFromDateTime(values[dateFrom_idx], values[timeFrom_idx]),
        toIso: toIsoFromDateTime(values[dateTo_idx], values[timeTo_idx])
      }].filter(r => r.fromIso)

    if (tidpunkter_idx >= 0) {
      const extracted = extractTidpunkter(lines[i])
      if (extracted.length > 0) {
        ranges = extracted
      }
    }

    if (!ranges.length) {
      continue
    }

    const baseProperties = [
      {
        TypeId: 'handelseE3',
        Value: parseBoolean(values[handelseE3_idx])
      },
      {
        TypeId: 'handelseE4',
        Value: values[handelseE4_idx] || ''
      },
      {
        TypeId: 'handelseE7',
        Value: values[handelseE7_idx] || ''
      },
      {
        TypeId: 'handelseE5',
        Value: values[handelseE5_idx] || ''
      },
      {
        TypeId: 'handelseE6',
        Value: values[handelseE6_idx] || ''
      }
    ]

    const baseId = generateUUID()

    ranges.forEach(range => {
      const entity = {
        Id: baseId,
        TypeId: 'handelse',
        LabelShort: values[handelseE6_idx] || '',
        LabelLong: values[handelseE6_idx] || '',
        Properties: baseProperties,
        InternalId: generateUUID(),
        SourceSystemId: '',
        DateFrom: range.fromIso,
        DateTo: range.toIso
      }

      result.Entities.push(entity)
    })
  }

  return result
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

window.global_tidredovisning_import = global_tidredovisning_import
