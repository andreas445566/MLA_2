# Demonstration: Vad kan extraheras från index.html?

## Syfte
Detta dokument demonstrerar vad en angripare **kan** och **inte kan** extrahera från index.html.

---

## ✅ VAD KAN EXTRAHERAS (utan lösenord)

### 1. Salt-värde
```javascript
// Från index.html, hitta:
staticryptSaltUniqueVariableName: "ed97ea2ab845108aed982fbfbc0b1253"

// Samma värde finns också i .staticrypt.json:
{
    "salt": "ed97ea2ab845108aed982fbfbc0b1253"
}
```

**Vad betyder detta?**
- Salt-värdet är designat att vara publikt
- Det används för att göra krypteringen mer säker
- Att ha salt-värdet hjälper INTE angriparen att dekryptera innehållet

### 2. Krypterad data (Ciphertext)
```javascript
// Från index.html, hela den krypterade meddelandet:
staticryptEncryptedMsgUniqueVariableName: "a9acb0b7206c578862578566ac78e997..."
// (väldigt lång hex-sträng med krypterad data)
```

**Vad betyder detta?**
- Detta är det krypterade innehållet
- Utan rätt lösenord kan det INTE dekrypteras
- Men det kan användas för offline brute-force attacker

### 3. Krypteringsparametrar
```javascript
// Synligt i koden:
- Algoritm: AES-GCM (via WebCrypto API)
- PBKDF2 iterationer: ~600,000 totalt
  - 1,000 SHA-1 (legacy round)
  - 14,000 SHA-256 (second round)
  - 585,000 SHA-256 (third round)
```

**Vad betyder detta?**
- Angriparen vet exakt vilken algoritm som används
- Detta låter dem optimera sina brute-force verktyg
- Men algoritmen i sig är säker (AES-GCM är industri-standard)

### 4. Metadata
```html
<title>Protected Page</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**Vad betyder detta?**
- Angriparen kan se sidans titel och metadata
- Men inte det faktiska skyddade innehållet

---

## ❌ VAD KAN INTE EXTRAHERAS

### 1. Själva lösenordet
```
❌ Lösenordet finns INTE i index.html
❌ Lösenordet kan INTE beräknas från salt-värdet
❌ Lösenordet kan INTE extraheras från den krypterade datan
```

### 2. Det skyddade innehållet
```
❌ Innehållet kan INTE läsas utan rätt lösenord
❌ Det finns ingen "backdoor" eller alternativ dekrypteringsmetod
❌ Inga "clues" eller ledtrådar om innehållet finns tillgängliga
```

### 3. Lösenordets hash (direkt)
```
❌ En hashard version av lösenordet finns INTE lagrad
❌ Ingen "target hash" att jämföra mot
```

---

## ⚠️ RISKEN: Offline Brute-Force Attacker

### Hur en attack skulle fungera:

1. **Extrahera data från index.html:**
   ```bash
   # Angriparen laddar ner index.html
   wget https://example.com/index.html
   
   # Extraherar salt och encrypted data
   # (kan göras med ett enkelt script)
   ```

2. **Testa lösenord offline:**
   ```python
   # Pseudo-kod för attack:
   for password in password_list:
       # Hash lösenordet med salt (PBKDF2, 600k iterationer)
       hashed = pbkdf2_sha256(password, salt, 600000)
       
       # Försök dekryptera
       try:
           decrypted = aes_gcm_decrypt(encrypted_data, hashed)
           if decrypted.is_valid():
               print(f"Password found: {password}")
               break
       except:
           continue  # Felaktigt lösenord, fortsätt
   ```

3. **Tidsestimat för olika lösenord:**
   
   Med modern hårdvara (GPU):
   - `password123` → **< 1 sekund**
   - `Password1` → **< 1 minut**
   - `MySecretPassword` → **Minuter till timmar**
   - `P@ssw0rd!2024` → **Dagar till veckor**
   - `7hG$k9Lm#pQ2rT5w` (16+ random) → **Århundraden till årmiljarder**

   **Varför är det långsamt?**
   - 600,000 PBKDF2 iterationer per gissning
   - Detta är AVSIKTLIGT för att sakta ner attacker
   - Men svaga lösenord kan fortfarande crackas

---

## 🛡️ HUR SKYDDA SIG

### 1. Använd ett extremt starkt lösenord

**Dåligt exempel (kan crackas):**
```
❌ "password"
❌ "secret123"
❌ "MinHemligaLösenord"
❌ "ILoveSweden2024"
```

**Bra exempel (praktiskt omöjligt att cracka):**
```
✅ "K7$mN9@pL2#qR5xW8vT3&gH6"
✅ "correct-horse-battery-staple-7$9K" (xkcd-stil med extra tecken)
✅ Använd en lösenordshanterare för att generera!
```

### 2. Förstå begränsningarna

**StatiCrypt är BRA för:**
- Skydda innehåll från tillfälliga besökare
- Dela statiska sidor med grundläggande skydd
- Utvecklings- och test-miljöer

**StatiCrypt är INTE lämpligt för:**
- Mycket känslig information (GDPR, persondata, hemligheter)
- Skydd mot dedikerade, motiverade angripare
- Compliance-krav som kräver server-side säkerhet

### 3. Överväg alternativ för känslig data

```
För verkligt känslig data:
✅ Server-side autentisering (OAuth, JWT)
✅ Privata repositories med åtkomstkontroll
✅ End-to-end encryption med separata nycklar
✅ Cloud storage med IAM (AWS, Azure, GCP)
```

---

## 🔍 Praktisk Demonstration

### Extrahera krypterad data (för utbildningssyfte):

```bash
# 1. Öppna index.html i en texteditor
# 2. Sök efter "staticryptEncryptedMsgUniqueVariableName"
# 3. Kopiera hela hex-strängen

# Eller använd kommandoradverktyg:
grep -o '"staticryptEncryptedMsgUniqueVariableName":"[^"]*"' index.html

# Extrahera salt:
grep -o '"staticryptSaltUniqueVariableName":"[^"]*"' index.html
```

### Testa dekryptering med fel lösenord:

```bash
# Öppna index.html i en webbläsare
# Försök med fel lösenord:
# - Du får meddelandet "Bad password!"
# - Ingen ledtråd om rätt lösenord ges
# - Du kan fortsätta gissa hur många gånger som helst
```

---

## 📊 Sammanfattning

| Vad?                          | Kan extraheras? | Risk?          |
|-------------------------------|-----------------|----------------|
| Lösenord (plaintext)          | ❌ NEJ          | Ingen          |
| Salt-värde                    | ✅ JA           | Låg            |
| Krypterad data                | ✅ JA           | Medium-Hög*    |
| Krypteringsalgoritm           | ✅ JA           | Låg            |
| Skyddat innehåll              | ❌ NEJ          | Ingen**        |

\* Risken beror helt på lösenordets styrka
\** Såvida inte lösenordet är svagt

---

## ✅ Slutsats

**Till frågan: "Kan man från index.html extrahera lösenordet?"**

**Svar:**
- **DIREKT:** Nej, lösenordet finns inte i filen
- **INDIREKT:** Med ett svagt lösenord kan angripare:
  1. Extrahera krypterad data + salt
  2. Köra offline brute-force
  3. Eventuellt hitta lösenordet

**LÖSNING:**
**Använd ett mycket starkt, slumpmässigt lösenord (16+ tecken)!**

Detta gör offline-attacker praktiskt omöjliga, även om angriparen har tillgång till den krypterade datan.

---

*Dokument skapat för utbildningssyfte*
*Se SECURITY.md för fullständig säkerhetsanalys*
