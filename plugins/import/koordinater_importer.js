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
  const headers = lines[0].split(',').map(h => h.trim())
  const notering_idx = headers.indexOf('Notering')
  const tidpunkt_idx = headers.indexOf('Tidpunkt')
  const latitud_idx = headers.indexOf('Latitud')
  const longitud_idx = headers.indexOf('Longitud')

  if (notering_idx === -1 || tidpunkt_idx === -1 || latitud_idx === -1 || longitud_idx === -1) {
    result.ErrorMessage = "CSV-filen måste innehålla kolumner: Notering, Tidpunkt, Latitud, Longitud"
    return result
  }

  // Parsa dataraderna
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())

    if (values.length < Math.max(notering_idx, tidpunkt_idx, latitud_idx, longitud_idx) + 1) {
      continue // Hoppa över rad med för få värden
    }

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
          TypeId: 'koordinatE2',
          Value: values[tidpunkt_idx] ? new Date(values[tidpunkt_idx]).toISOString() : new Date().toISOString()
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
      DateFrom: new Date().toISOString(),
      DateTo: undefined
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
