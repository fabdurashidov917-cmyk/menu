# 👑 Zarafshon Grand Restaurant — Veb-Sayt & Taomnoma

Toshkentdagi eng hashamatli milliy va yevropa oshxonasi uchun yaratilgan zamonaviy, tezkor va interaktiv restoran veb-sayti. 

Ushbu loyiha **GitHub Pages** uchun to'liq moslashtirilgan bo'lib, hech qanday server yoki murakkab backend o'rnatmasdan to'g'ridan-to'g'ri brauzerda ishlaydi.

---

## 🌟 Sayt Xususiyatlari

- **34 ta saralangan taom:**
  - 🍲 **Milliy Taomlar** (To'y oshi, Zarchava osh, Qozon kabob, Tandir go'sht, Norin, Manti, Qovurma lag'mon, Jiz, Dimlama)
  - 🍢 **Kaboblar & Steyklar** (G'ijduvon shashlik, Bo'ktirma qo'y, Jigar-dumba, Tovuq qanotlari, Ribay steyk, To'sh kabob)
  - 🥣 **Sho'rvalar** (Ko'za sho'rva, Chuchvara, Qatiqli mastava, Forel baliq sho'rva, Cho'zma lag'mon)
  - 🥗 **Salatlar & Gazaklar** (Anorli Achchiq-chuchuk, Mujskoy kapriz, Sezar, Tog' suzmasi, Yunoncha)
  - 🍰 **Desertlar** (Buxorocha pahlava, Medovik, San-Sebastian chizkeyk, Shokoladli fondan, Halvoytar)
  - 🫖 **Choy va Ichimliklar** (Rayhonli xon choyi, Quva anor sharbati, Qulupnayli moxito, Tog' ayrani)
- **Haqiqiy O'zbekiston narxlari:** Barcha narxlar so'mda (UZS).
- **Jonli Qidiruv va Toifalar:** Taom nomi yoki tarkibidagi masalliqlar bo'yicha tezkor filter.
- **Interaktiv Savat va Buyurtma:** Taomlarni savatga yig'ish, 10% xizmat haqi avtomatik hisobi va buyurtma rasmiylashtirish.
- **Batafsil Taom Modali:** Kaloriya, porsiya og'irligi, tayyorlanish vaqti va to'liq masalliqlar tarkibi.
- **Onlayn Stol Bron Qilish:** Sana, vaqt, mehmonlar soni va zal turi (VIP, Terrasa, Umumiy zal).
- **Open Graph Preview:** Telegram, WhatsApp va ijtimoiy tarmoqlarda havola yuborilganda chiroyli rasm va tavsif chiqadi.

---

## 🚀 GitHub Pages-da Saytni Chiqarish (2 Daqiqada)

Saytni internetda bepul va ommaviy ishga tushirish uchun 2 xil qulay usul mavjud:

### 1-usul: GitHub Veb-sayti orqali (Eng oson)
1. **GitHub.com** saytiga kiring va o'z hisobingizga kiring.
2. Yangi ombor (Repository) yarating, masalan: `milliy-taomlar-restorani` (Public qilib belgilang).
3. Ushbu papkadagi barcha fayllarni:
   - `index.html`
   - `styles.css`
   - `data.js`
   - `app.js`
   - `.nojekyll`
   - `404.html`
   - `README.md`
   GitHub omboringizga yuklang (**Add file** -> **Upload files** -> **Commit changes**).
4. Omboringizdagi **Settings** bo'limiga o'ting.
5. Chap menyudan **Pages** bo'limini tanlang.
6. **Build and deployment** bo'limida:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (yoki `master`) va `/ (root)` papkasini tanlang.
   - **Save** tugmasini bosing.
7. 1 daqiqadan so'ng sizning shaxsiy saytingiz tayyor bo'ladi:
   👉 `https://<sizning-username>.github.io/milliy-taomlar-restorani/`

---

### 2-usul: Git Terminal orqali
Agar kompyuteringizda `git` o'rnatilgan bo'lsa:

```bash
cd "C:\Users\user\.gemini\antigravity\scratch\milliy-taomlar-restorani"
git init
git add .
git commit -m "Zarafshon Grand Restaurant v1.0"
git branch -M main
git remote add origin https://github.com/<sizning-username>/milliy-taomlar-restorani.git
git push -u origin main
```

Keyin **Settings** -> **Pages** bo'limidan `main` branch-ni tanlab faollashtiring.

---

## 📁 Loyiha Strukturasi

```text
milliy-taomlar-restorani/
├── index.html       # Asosiy sahifa (Semantik HTML5, OG tags)
├── styles.css       # Hashamatli qorong'u/oltin mavzu dizayni
├── data.js          # 34 ta taomning to'liq ma'lumotlar bazasi
├── app.js           # Filter, qidiruv, savat va modal logikasi
├── 404.html         # GitHub Pages uchun moslashtirilgan 404 xatolik sahifasi
├── .nojekyll        # Jekyll statik generatorini chetlab o'tish uchun fayl
└── README.md        # Loyiha qo'llanmasi
```

---

© 2026 Zarafshon Grand Restaurant. O'zbekistonda tayyorlangan.
