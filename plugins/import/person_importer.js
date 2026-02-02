// SPDX-FileCopyrightText: 2024 Skatteverket - Swedish Tax Agency
//
// SPDX-License-Identifier: EUPL-1.2

function global_person_import(csvfile) {
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

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const getIdx = (names) => names.map(n => headers.indexOf(n)).find(i => i !== -1)

  const idxPersonnr = getIdx(['personnummer', 'personnr', 'person-/samordningsnummer'])
  const idxFornamn = getIdx(['förnamn', 'fornamn'])
  const idxEfternamn = getIdx(['efternamn'])
  const idxKon = getIdx(['kön', 'kon'])
  const idxStatus = getIdx(['status'])
  const idxAssistans = getIdx(['assistansersättning', 'assistansersattning'])
  const idxRelationPersonTyp = getIdx(['relation till personen'])
  const idxRelationsPersonnummer = getIdx(['relationspersonnummer', 'personnummer till relationsperson'])
  const idxRelationBolagTyp = getIdx(['relation till bolaget'])
  const idxOrgNr = getIdx(['orgnr', 'org nr', 'org.nr', 'organisationsnummer', 'organisationsnnummer'])

  if (idxPersonnr == null) {
    result.ErrorMessage = "CSV-filen måste innehålla kolumnen: Personnummer"
    return result
  }

  const normalizeKon = (v) => {
    const val = (v || '').toString().trim().toLowerCase()
    if (val.startsWith('m')) return 'M'
    if (val.startsWith('k')) return 'K'
    if (val === '0' || val === 'okänt' || val === 'okant') return '0'
    return v || ''
  }

  const normalizeAssistans = (v) => {
    const val = (v || '').toString().trim().toLowerCase()
    if (val === 'anhorig') return 'anhörig'
    if (val === 'assistent') return 'assistent'
    if (val === 'brukare') return 'brukare'
    return v || ''
  }

  const normalizeStatus = (v) => {
    const val = (v || '').toString().trim().toLowerCase()
    if (val === 'avliden') return 'avliden'
    if (val === 'falsk identitet' || val === 'falsk_identitet') return 'falsk identitet'
    if (val === 'utvandrad') return 'utvandrad'
    return v || ''
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    if (values.length === 0 || (values[idxPersonnr] || '').length === 0) {
      continue
    }

    const personnummer = values[idxPersonnr]
    const fornamn = idxFornamn != null ? values[idxFornamn] : ''
    const efternamn = idxEfternamn != null ? values[idxEfternamn] : ''
    const kon = idxKon != null ? normalizeKon(values[idxKon]) : ''
    const status = idxStatus != null ? normalizeStatus(values[idxStatus]) : ''
    const assistans = idxAssistans != null ? normalizeAssistans(values[idxAssistans]) : ''
    const relationPersonTyp = idxRelationPersonTyp != null ? values[idxRelationPersonTyp] : ''
    const relationsPersonnummer = idxRelationsPersonnummer != null ? values[idxRelationsPersonnummer] : ''
    const relationBolagTyp = idxRelationBolagTyp != null ? values[idxRelationBolagTyp] : ''
    const orgNr = idxOrgNr != null ? values[idxOrgNr] : ''

    const props = []
    props.push({ TypeId: 'personE1', Value: personnummer })
    if (fornamn) props.push({ TypeId: 'personE2', Value: fornamn })
    if (efternamn) props.push({ TypeId: 'personE3', Value: efternamn })
    if (kon) props.push({ TypeId: 'personE5', Value: kon })
    if (status) props.push({ TypeId: 'personE6', Value: status })
    if (assistans) props.push({ TypeId: 'personE7', Value: assistans })
    if (relationPersonTyp) props.push({ TypeId: 'personE10', Value: relationPersonTyp })
    if (relationsPersonnummer) props.push({ TypeId: 'personE8', Value: relationsPersonnummer })
    if (relationBolagTyp) props.push({ TypeId: 'personE11', Value: relationBolagTyp })
    if (orgNr) props.push({ TypeId: 'personE9', Value: orgNr })

    result.Entities.push({
      Id: personnummer || generateUUID(),
      TypeId: 'person',
      LabelShort: `${fornamn} ${efternamn}`.trim() || personnummer,
      LabelLong: `${fornamn} ${efternamn}`.trim() || personnummer,
      Properties: props,
      InternalId: '',
      SourceSystemId: '',
      DateFrom: undefined,
      DateTo: undefined
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
