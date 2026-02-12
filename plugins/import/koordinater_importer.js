// SPDX-FileCopyrightText: 2024 Skatteverket - Swedish Tax Agency
//
// SPDX-License-Identifier: EUPL-1.2

function global_koordinater_import(csvfile) {
  const result = {
    Entities: [],
    Links: [],
    Events: [],
    ErrorMessage: ""
  }

  const lines = csvfile.split('\n').map(line => line.trim()).filter(line => line)

  if (lines.length < 2) {
    result.ErrorMessage = "CSV-filen måste innehålla minst en header-rad och en datarад"
    return result
  }

  // Parsa header
  const headerLine = lines[0]
  const countDelimiter = (line, delimiter) => line.split(delimiter).length
  const delimiterCandidates = [',', ';', '\t']
  const delimiter = delimiterCandidates.reduce((best, current) =>
    countDelimiter(headerLine, current) > countDelimiter(headerLine, best) ? current : best
  )

  const splitLine = (line) => line.split(delimiter).map(h => h.trim())

  const headers = splitLine(headerLine)
  const normalizeHeader = (value) => value
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()

  const normalizedHeaders = headers.map(normalizeHeader)
  const findHeaderIndex = (name) => normalizedHeaders.indexOf(name.toLowerCase())

  const notering_idx = findHeaderIndex('Notering')
  const latitud_idx = findHeaderIndex('Latitud')
  const longitud_idx = findHeaderIndex('Longitud')
  const personnummer_idx = findHeaderIndex('Personnummer')
  const datum_idx = findHeaderIndex('Datum')
  const tid_idx = findHeaderIndex('Tid')
  const tidpunkt_idx = findHeaderIndex('Tidpunkt')

  if (notering_idx === -1 || latitud_idx === -1 || longitud_idx === -1) {
    result.ErrorMessage = "CSV-filen måste innehålla kolumner: Notering, Latitud, Longitud"
    return result
  }

  const toTidpunktFromDatumTid = (datumValue, tidValue) => {
    const rawDate = (datumValue || '').trim()
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(rawDate)) {
      return undefined
    }

    const [yearPart, monthPart, dayPart] = rawDate.split('-')
    const year = Number(yearPart)
    const month = Number(monthPart) - 1
    const day = Number(dayPart)

    const rawTime = (tidValue || '').trim()
    if (/^[0-9]{2}:[0-9]{2}$/.test(rawTime)) {
      return `${rawDate} ${rawTime}`
    }

    const dt = new Date(year, month, day)
    return isNaN(dt.getTime()) ? undefined : rawDate
  }

  const toTidpunktFromTidpunkt = (tidpunktValue) => {
    const raw = (tidpunktValue || '').trim()
    if (!raw) {
      return undefined
    }
    return raw
  }

  const parseTidpunktToDate = (value) => {
    const raw = (value || '').trim()
    if (!raw) return undefined

    const dateTimeMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/)
    if (dateTimeMatch) {
      const [, y, m, d, hh, mm] = dateTimeMatch
      const dt = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm))
      return isNaN(dt.getTime()) ? undefined : dt
    }

    const dateMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (dateMatch) {
      const [, y, m, d] = dateMatch
      const dt = new Date(Number(y), Number(m) - 1, Number(d), 0, 0)
      return isNaN(dt.getTime()) ? undefined : dt
    }

    const parsed = new Date(raw)
    return isNaN(parsed.getTime()) ? undefined : parsed
  }

  // Parsa dataraderna
  for (let i = 1; i < lines.length; i++) {
    const values = splitLine(lines[i])

    if (values.length < Math.max(notering_idx, latitud_idx, longitud_idx) + 1) {
      continue // Hoppa över rad med för få värden
    }

    const tidpunktFrånTidpunkt = tidpunkt_idx >= 0 ? toTidpunktFromTidpunkt(values[tidpunkt_idx]) : undefined
    const tidpunktFrånDatumTid = (datum_idx >= 0 || tid_idx >= 0)
      ? toTidpunktFromDatumTid(values[datum_idx], values[tid_idx])
      : undefined
    const dateValue = tidpunktFrånTidpunkt ?? tidpunktFrånDatumTid ?? new Date().toISOString()
    const dateValueParsed = parseTidpunktToDate(dateValue)
    const dateToValue = dateValueParsed ? new Date(dateValueParsed.getTime() + 5 * 60000).toISOString() : undefined

    const entity = {
      Id: generateUUID(),
      TypeId: 'koordinater',
      LabelShort: values[notering_idx] || '',
      LabelLong: values[notering_idx] || '',
      Properties: [
        {
          TypeId: 'koordinatE1',
          Value: values[notering_idx] || ''
        },
        {
          TypeId: 'koordinatE3',
          Value: values[latitud_idx] ? values[latitud_idx].replace(',', '.') : ''
        },
        {
          TypeId: 'koordinatE4',
          Value: values[longitud_idx] ? values[longitud_idx].replace(',', '.') : ''
        }
      ],
      InternalId: '',
      SourceSystemId: '',
      DateFrom: dateValue,
      DateTo: dateToValue
    }

    if (personnummer_idx >= 0 && values[personnummer_idx]) {
      entity.Properties.push({
        TypeId: 'koordinatE6',
        Value: values[personnummer_idx]
      })
    }

    result.Entities.push(entity)
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
