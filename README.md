# MLA_2 - Mönster Länk Analys Verktyg

Ett verktyg för mönster- och länkanalys, skyddat med klient-sidokryptering.

## 🔒 Säkerhet

Denna applikation använder [StatiCrypt](https://github.com/robinmoisson/staticrypt) för att skydda innehållet med ett lösenord.

### ⚠️ VIKTIGT: Lösenordssäkerhet

**Använd ett starkt lösenord!** 

Eftersom krypteringen sker på klientsidan kan angripare:
- Ladda ner den krypterade filen
- Utföra offline brute-force-attacker
- Potentiellt cracka svaga lösenord

### Rekommenderat lösenord:
- ✅ Minst 16 tecken långt
- ✅ Blandat med stora/små bokstäver, siffror och specialtecken
- ✅ Slumpmässigt genererat (använd en lösenordshanterare)
- ✅ Unikt för denna applikation

### ❌ Använd INTE:
- ❌ Vanliga ord eller namn
- ❌ Korta lösenord (< 12 tecken)
- ❌ Lösenord som används på andra ställen
- ❌ Lösenord från listor eller tidigare intrång

## 📖 Säkerhetsanalys

För detaljerad information om säkerheten, se [SECURITY.md](SECURITY.md).

### Snabb sammanfattning:
- Lösenordet finns **INTE** i klartext i index.html
- Men den krypterade datan **ÄR** tillgänglig för offline attacker
- Ett starkt lösenord är **AVGÖRANDE** för säkerheten

## 🚀 Användning

1. Öppna `index.html` i en webbläsare
2. Ange lösenordet när du uppmanas
3. Innehållet dekrypteras och visas i din webbläsare

## 🔧 Utveckling

### Struktur:
```
MLA_2/
├── index.html              # Krypterad huvudfil
├── .staticrypt.json        # StatiCrypt konfiguration (salt)
├── assets/                 # Statiska tillgångar
├── config/                 # Konfigurationsfiler
├── plugins/                # Plugin-moduler
├── manifest.json           # Web app manifest
├── SECURITY.md            # Säkerhetsanalys och rekommendationer
└── README.md              # Denna fil
```

### Uppdatera krypterat innehåll:

Om du har tillgång till den okrypterade versionen:

```bash
# Installera StatiCrypt
npm install -g staticrypt

# Kryptera din HTML-fil
staticrypt your-file.html -o index.html

# Eller med specifikt salt för att behålla kompatibilitet
staticrypt your-file.html -o index.html --salt ed97ea2ab845108aed982fbfbc0b1253
```

**OBS om salt-återanvändning:**
- Använd samma salt om du vill att befintliga användare ska kunna använda sitt sparade lösenord
- Salt-värdet behöver inte vara hemligt, det är designat att vara publikt
- För bästa säkerhet vid ny kryptering: byt BÅDE lösenord och salt samtidigt
- Detta kräver att alla användare får det nya lösenordet

## ⚡ Prestandaöverväganden

Dekryptering sker i webbläsaren och kan ta några sekunder beroende på:
- Enhetens prestanda
- Lösenordets komplexitet (fler iterationer = bättre säkerhet men långsammare)
- Storleken på det krypterade innehållet

## 🛡️ Säkerhetsrekommendationer

1. **Lösenordshantering:**
   - Använd en lösenordshanterare (1Password, Bitwarden, KeePass)
   - Generera slumpmässiga lösenord
   - Dela inte lösenordet via osäkra kanaler

2. **Åtkomstkontroll:**
   - Dokumentera vem som har tillgång till lösenordet
   - Byt lösenord om det kan ha kompromettats
   - Överväg regelbundna lösenordsbyten för känslig data

3. **Alternativ för högre säkerhet:**
   - Server-side autentisering
   - Privata repositories med åtkomstkontroll
   - API-baserade lösningar med JWT tokens

## 📝 Licens

Se projektets licensfil för information.

## 🤝 Bidrag

Vid bidrag till projektet, se till att:
- Inte committa okrypterat innehåll
- Inte committa lösenord eller känslig information
- Följa säkerhetsriktlinjerna i SECURITY.md

## 📞 Support

För säkerhetsproblem eller frågor, kontakta projektägaren.

---

**Viktig påminnelse:** Klient-sidokryptering är bekvämt men har begränsningar. För mycket känslig data, överväg server-side lösningar med professionell säkerhetsarkitektur.
