# Snabbstart: Säkerhetsöversikt

## 🔐 Kan man extrahera lösenordet från index.html?

### ⚡ Snabbt svar
**NEJ** - lösenordet finns inte i filen  
**MEN** - svaga lösenord kan crackas via offline-attacker

---

## 📋 Vad du behöver göra NU

### 1️⃣ Kontrollera ditt lösenord
```bash
./check-password.sh
```
Välj option 1 och testa ditt nuvarande lösenord.

### 2️⃣ Om lösenordet är svagt
```bash
./check-password.sh
```
Välj option 2 för att generera ett nytt starkt lösenord.

### 3️⃣ Läs säkerhetsanalys
- 📖 [SUMMARY.md](SUMMARY.md) - Fullständig sammanfattning
- 📖 [SECURITY.md](SECURITY.md) - Detaljerad säkerhetsanalys
- 📖 [README.md](README.md) - Användningsguide

---

## ✅ Minimikrav för lösenord

```
✅ Minst 16 tecken
✅ Stora och små bokstäver
✅ Siffror
✅ Specialtecken (!@#$%^&*)
✅ Slumpmässigt genererat
```

---

## ⚠️ Varför är detta viktigt?

StatiCrypt använder **client-side encryption**, vilket betyder:

1. ✅ **Fördel:** Enkelt att dela skyddat innehåll
2. ⚠️ **Nackdel:** Krypterad data kan attackeras offline
3. 🔐 **Lösning:** Använd extremt starka lösenord

---

## 📚 Dokumentation

| Fil | Innehåll |
|-----|----------|
| `SUMMARY.md` | Komplett sammanfattning |
| `SECURITY.md` | Säkerhetsanalys (svenska/engelska) |
| `EXTRACTION_DEMO.md` | Teknisk demonstration |
| `README.md` | Användningsguide |
| `check-password.sh` | Lösenordsverktyg |

---

## 🛠️ Verktyg: check-password.sh

### Testa lösenord
```bash
./check-password.sh
# Välj 1: Test a password
```

### Generera nytt lösenord
```bash
./check-password.sh
# Välj 2: Generate a strong password
```

### Visa krav
```bash
./check-password.sh
# Välj 3: Show password requirements
```

---

## 🎯 Ta reda på mer

### Vad kan extraheras?
- Salt-värdet (publikt, inte hemligt)
- Krypterad data (kan inte läsas utan lösenord)
- Krypteringsparametrar (publika)

### Vad kan INTE extraheras?
- Lösenordet (finns inte i filen)
- Det okrypterade innehållet
- Hash av lösenordet

### Risk
- Med svagt lösenord: **Hög risk** för offline-attack
- Med starkt lösenord (16+ random): **Minimal risk**

---

## 💡 Rekommenderad åtgärd

1. **Kör check-password.sh** för att testa ditt lösenord
2. **Generera nytt lösenord** om nuvarande är svagt
3. **Spara i lösenordshanterare** (1Password, Bitwarden, KeePass)
4. **Läs SECURITY.md** för fullständig förståelse

---

## ❓ Frågor?

Se fullständig dokumentation i:
- `SUMMARY.md` - Översikt och sammanfattning
- `SECURITY.md` - Detaljerad säkerhetsanalys
- `EXTRACTION_DEMO.md` - Tekniska detaljer

---

**Viktig poäng:** StatiCrypt är säkert MED ett starkt lösenord! ✅
