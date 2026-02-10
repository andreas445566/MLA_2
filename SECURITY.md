# Säkerhetsanalys: Lösenordsextraktion från index.html

## Sammanfattning (Summary)

**Svenska:**
Ja, det är tekniskt möjligt att extrahera information från index.html som kan användas för att attackera lösenordet, även om själva lösenordet inte finns i klartext i filen.

**English:**
Yes, it is technically possible to extract information from index.html that can be used to attack the password, even though the password itself is not stored in plaintext in the file.

---

## Hur StatiCrypt fungerar (How StatiCrypt Works)

index.html är skyddad med [StatiCrypt](https://github.com/robinmoisson/staticrypt), ett verktyg för klient-sidokryptering av HTML-sidor.

### Krypteringsprocessen:
1. Det ursprungliga HTML-innehållet krypteras med ett lösenord
2. Den krypterade datan lagras i variabeln `staticryptEncryptedMsgUniqueVariableName`
3. Ett salt (slumpmässigt värde) lagras i `staticryptSaltUniqueVariableName`
4. När användaren anger lösenordet dekrypteras innehållet i webbläsaren

---

## Säkerhetsrisker (Security Risks)

### 1. Offline Brute-Force Attacker

**Problem:**
- Den krypterade datan och salt-värdet finns i index.html
- En angripare kan ladda ner filen och utföra offline brute-force-attacker
- Angriparen behöver inte interagera med webbservern

**Exempel på attack:**
```bash
# En angripare kan extrahera:
# 1. Encrypted content: staticryptEncryptedMsgUniqueVariableName
# 2. Salt: staticryptSaltUniqueVariableName (also in .staticrypt.json)
# 3. Perform offline password cracking
```

### 2. Svaga Lösenord

Om lösenordet är:
- Kort (< 12 tecken)
- Ett vanligt ord eller namn
- Saknar blandning av stora/små bokstäver, siffror och specialtecken
- Finns i ordlistor eller tidigare dataintrång

...kan det crackas relativt snabbt med moderna verktyg.

---

## Vad kan INTE extraheras (What CANNOT be extracted)

❌ Själva lösenordet i klartext finns INTE i index.html
❌ Det går INTE att dekryptera innehållet utan rätt lösenord
❌ Salt-värdet ensamt hjälper INTE till att hitta lösenordet

---

## Vad kan extraheras (What CAN be extracted)

✅ Den krypterade datan (ciphertext)
✅ Salt-värdet som används för kryptering
✅ Krypteringsalgoritmen och parametrar (synliga i koden)
✅ Möjlighet att testa miljontals lösenord offline

---

## Rekommendationer (Recommendations)

### 1. Använd ett starkt lösenord (Use a Strong Password)

**Minimum rekommendation:**
- Minst 16 tecken
- Blandning av stora och små bokstäver
- Siffror och specialtecken
- Inte ett ord från ordboken
- Unikt för denna applikation

**Exempel på stark lösenordsgenerering:**
```bash
# Generera ett starkt slumpmässigt lösenord (Linux/Mac)
openssl rand -base64 24

# Eller använd en lösenordshanterare som:
# - 1Password
# - Bitwarden
# - KeePass
```

### 2. Överväg alternativa säkerhetslösningar

För känslig data, överväg:
- **Server-side autentisering** istället för klient-side kryptering
- **OAuth/OIDC** för användarautentisering
- **API med JWT tokens** för åtkomstkontroll
- **Privata repositories** istället för publika med kryptering

### 3. Begränsningar med klient-sidokryptering

Förstå att klient-sidokryptering (som StatiCrypt) är lämplig för:
- ✅ Skydd av innehåll från tillfälliga besökare
- ✅ Enkel delning av skyddat innehåll via statiska sidor
- ✅ Lågriskscenarion där bekvämlighet är viktigare än maximal säkerhet

Men INTE för:
- ❌ Skydd av mycket känslig information
- ❌ Skydd mot dedikerade angripare
- ❌ Compliance-krav (GDPR, HIPAA, etc.)

### 4. Regelbundna säkerhetsgranskningar

- [ ] Granska lösenordsstyrka regelbundet
- [ ] Övervaka för säkerhetsuppdateringar av StatiCrypt
- [ ] Överväg byte av lösenord periodiskt
- [ ] Dokumentera vem som har tillgång till lösenordet

---

## Tekniska detaljer (Technical Details)

### Krypteringsparametrar i StatiCrypt:

```javascript
// Lösenordet hashas i flera steg:
// 1. PBKDF2 med SHA-1, 1000 iterationer (legacy)
// 2. PBKDF2 med SHA-256, 14000 iterationer  
// 3. PBKDF2 med SHA-256, 585000 iterationer

// Total: ~600,000 PBKDF2 iterationer
// Detta gör brute-force långsammare, men inte omöjligt för svaga lösenord
```

### Extrahera krypterad data (för testning):

```javascript
// I browser console på index.html:
console.log(staticryptConfig.staticryptEncryptedMsgUniqueVariableName);
console.log(staticryptConfig.staticryptSaltUniqueVariableName);
```

---

## Slutsats (Conclusion)

**Svar på frågan: "Kan man från index.html extrahera lösenordet?"**

**Direkt svar:** Nej, lösenordet i klartext finns inte i filen.

**Nyanserat svar:** Ja, om lösenordet är svagt kan en angripare:
1. Extrahera den krypterade datan och salt-värdet från index.html
2. Använda offline brute-force verktyg för att testa miljontals lösenord
3. Eventuellt hitta lösenordet om det är tillräckligt svagt

**Bästa praxis:** Använd ett mycket starkt, slumpmässigt genererat lösenord (minst 16 tecken) för att göra denna typ av attack praktiskt omöjlig.

---

## Ytterligare resurser (Additional Resources)

- [StatiCrypt GitHub](https://github.com/robinmoisson/staticrypt)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [How Secure Is My Password](https://www.security.org/how-secure-is-my-password/)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

*Dokument skapat: 2026-02-10*
*Baserat på analys av StatiCrypt implementation i index.html*
