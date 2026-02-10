# 📚 Dokumentationsindex

## 🔐 Säkerhetsfråga
**"KAN MAN FRÅN INDEX.HTML EXTRAHERA LÖSENORDET?"**

**Svar:** Se [QUICKSTART.md](QUICKSTART.md) för snabbt svar

---

## 📖 Dokumentation - Börja här

### 1️⃣ [QUICKSTART.md](QUICKSTART.md) ⚡ START HÄR
**Vad:** Snabbstart och omedelbara åtgärder  
**För:** Alla användare  
**Tid:** 5 minuter  
**Innehåll:**
- Snabbt svar på huvudfrågan
- Vad du behöver göra NU
- Hur man använder check-password.sh
- Minimikrav för lösenord

---

### 2️⃣ [SUMMARY.md](SUMMARY.md) 📋 SAMMANFATTNING
**Vad:** Komplett översikt av säkerhetsanalys  
**För:** Alla som vill förstå helheten  
**Tid:** 15-20 minuter  
**Innehåll:**
- Detaljerat svar på frågan
- Teknisk förklaring av StatiCrypt
- Säkerhetsrisker och begränsningar
- Rekommendationer och verktyg
- Tidsestimat för lösenordscrackning

---

### 3️⃣ [SECURITY.md](SECURITY.md) 🛡️ SÄKERHETSANALYS
**Vad:** Djupgående säkerhetsanalys  
**För:** Utvecklare och säkerhetsintresserade  
**Tid:** 20-30 minuter  
**Innehåll:**
- Hur StatiCrypt fungerar (svenska & engelska)
- Detaljerade säkerhetsrisker
- Krypteringsparametrar
- Begränsningar med client-side encryption
- Fullständiga rekommendationer
- Alternativa säkerhetslösningar

---

### 4️⃣ [EXTRACTION_DEMO.md](EXTRACTION_DEMO.md) 🔍 TEKNISK DEMO
**Vad:** Praktisk demonstration  
**För:** Tekniskt intresserade  
**Tid:** 15-20 minuter  
**Innehåll:**
- Vad kan extraheras (steg-för-steg)
- Vad kan INTE extraheras
- Hur offline-attacker fungerar
- Praktiska exempel med kod
- Skyddsstrategier

---

### 5️⃣ [README.md](README.md) 📘 ANVÄNDNINGSGUIDE
**Vad:** Projektöversikt och användning  
**För:** Nya användare  
**Tid:** 10 minuter  
**Innehåll:**
- Projektbeskrivning
- Säkerhetsvarningar
- Användningsinstruktioner
- Utvecklingsinformation
- Struktur och filöversikt

---

## 🛠️ Verktyg

### check-password.sh
**Typ:** Interaktivt skript  
**Funktion:** Testa och generera lösenord  
**Användning:**
```bash
./check-password.sh
```

**Funktioner:**
1. Testa lösenordsstyrka
2. Generera starkt slumpmässigt lösenord
3. Visa säkerhetskrav

---

## 📁 Konfiguration

### .gitignore
**Typ:** Git-konfiguration  
**Funktion:** Förhindra commit av känsliga filer  
**Innehåll:**
- Säkerhetsfiler (keys, secrets, .env)
- Okrypterade källfiler
- Temporära filer och build-artefakter

---

## 🎯 Läsordning beroende på behov

### Snabb översikt (5 min)
1. [QUICKSTART.md](QUICKSTART.md)

### Grundläggande förståelse (20 min)
1. [QUICKSTART.md](QUICKSTART.md)
2. [SUMMARY.md](SUMMARY.md)

### Fullständig förståelse (45 min)
1. [QUICKSTART.md](QUICKSTART.md)
2. [SUMMARY.md](SUMMARY.md)
3. [SECURITY.md](SECURITY.md)

### Teknisk djupdykning (60+ min)
1. [QUICKSTART.md](QUICKSTART.md)
2. [SUMMARY.md](SUMMARY.md)
3. [SECURITY.md](SECURITY.md)
4. [EXTRACTION_DEMO.md](EXTRACTION_DEMO.md)

### Första gången användare
1. [QUICKSTART.md](QUICKSTART.md)
2. [README.md](README.md)
3. Kör `./check-password.sh`

---

## ✅ Snabbreferens

| Fråga | Dokument |
|-------|----------|
| Kan lösenordet extraheras? | [QUICKSTART.md](QUICKSTART.md) |
| Hur fungerar StatiCrypt? | [SUMMARY.md](SUMMARY.md) |
| Vad är riskerna? | [SECURITY.md](SECURITY.md) |
| Hur testar jag mitt lösenord? | `./check-password.sh` |
| Tekniska detaljer? | [EXTRACTION_DEMO.md](EXTRACTION_DEMO.md) |
| Hur använder jag applikationen? | [README.md](README.md) |

---

## 📊 Dokumentationsstatistik

| Fil | Storlek | Typ | Språk |
|-----|---------|-----|-------|
| QUICKSTART.md | 2.7 KB | Guide | Svenska |
| SUMMARY.md | 7.7 KB | Sammanfattning | Svenska |
| SECURITY.md | 5.5 KB | Analys | Svenska & Engelska |
| EXTRACTION_DEMO.md | 6.5 KB | Demo | Svenska |
| README.md | 3.9 KB | Guide | Svenska |
| check-password.sh | 5.1 KB | Verktyg | Bash |
| .gitignore | 642 B | Config | - |

**Totalt:** ~32 KB dokumentation

---

## 🎓 Nyckelbegrepp

- **StatiCrypt:** Verktyg för client-side kryptering av HTML
- **Salt:** Publikt värde som används i kryptering (inte hemligt)
- **Ciphertext:** Krypterad data (synlig i index.html)
- **Offline brute-force:** Attack där angripare testar lösenord lokalt
- **PBKDF2:** Algoritm för att härleda krypteringsnyckel från lösenord
- **AES-GCM:** Krypteringsalgoritm som används (industri-standard)

---

## 💡 Viktigaste insikterna

1. ✅ Lösenordet finns **INTE** i klartext i index.html
2. ⚠️ Krypterad data **KAN** attackeras offline med svaga lösenord
3. 🔐 Lösning: Använd **mycket starkt** lösenord (16+ tecken)
4. 📚 Client-side encryption har **begränsningar** - förstå dem
5. 🛠️ Använd `check-password.sh` för att **testa** din säkerhet

---

## 📞 Support

För frågor eller funderingar:
1. Läs relevant dokumentation ovan
2. Kör `./check-password.sh` för lösenordshjälp
3. Kontakta projektägaren om nödvändigt

---

**Uppdaterad:** 2026-02-10  
**Version:** 1.0  
**Språk:** Svenska

**Huvudbudskap:** StatiCrypt är säkert med starka lösenord! ✅
