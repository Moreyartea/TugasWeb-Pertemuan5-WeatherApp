# Weather App — Tugas Rutin 5 (Pemrograman Web)

Aplikasi cuaca sederhana menggunakan **Vite + Vanilla JavaScript (ES6+) + Tailwind CSS**, dengan data dari [OpenWeatherMap](https://openweathermap.org/api).

**Live demo:** _(isi link Netlify di sini setelah deploy)_

## Fitur

- Pencarian cuaca berdasarkan nama kota (suhu, deskripsi, ikon, kelembaban)
- Penanganan error: kota tidak ditemukan (404) & error koneksi jaringan
- Loading state (skeleton)
- Riwayat pencarian tersimpan di LocalStorage (maks. 5, tanpa duplikat), klik untuk cari ulang
- Toggle satuan suhu °C / °F (tanpa fetch ulang)
- Toggle dark/light mode, preferensi tersimpan
- Layout responsif (mobile-first, Tailwind)

## Menjalankan secara lokal

1. Clone repo ini
2. Install dependencies:
   ```bash
   npm install
   ```
3. Salin `.env.example` menjadi `.env`, lalu isi dengan API key OpenWeatherMap kamu:
   ```
   VITE_API_KEY=xxxxxxxxxxxxxxxx
   ```
   Dapatkan API key gratis di https://home.openweathermap.org/api_keys (aktivasi key baru bisa butuh beberapa menit).
4. Jalankan dev server:
   ```bash
   npm run dev
   ```

## Build & Deploy (Netlify)

```bash
npm run build
```

Hasil build ada di folder `dist/`. Deploy dengan salah satu cara:

- **Drag-and-drop:** buka [app.netlify.com/drop](https://app.netlify.com/drop) dan seret folder `dist/`
- **Connect repo GitHub:** hubungkan repo ini di Netlify agar auto-deploy tiap push

Di kedua cara, set environment variable `VITE_API_KEY` di **Site settings → Environment variables** pada dashboard Netlify (jangan taruh key langsung di kode/commit).

## Struktur Proyek

```
src/
├── main.js               # entry point, wiring semua modul
├── style.css             # Tailwind directives
├── api/
│   └── weather.js        # getCurrentWeather(), getForecast() (forecast belum dipakai)
├── ui/
│   ├── render.js          # renderCurrentWeather(), renderHistory()
│   └── state.js           # showLoading(), showError(), showCard(), showEmpty()
└── utils/
    ├── storage.js         # riwayat pencarian (LocalStorage)
    ├── convert.js         # konversi °C ↔ °F
    └── theme.js            # dark/light mode
```

## Catatan

Fitur forecast 5 hari sengaja **ditunda** (bukan dibatalkan) — `getForecast()` di `src/api/weather.js` sudah disiapkan tapi belum dipanggil dari UI. Bisa ditambahkan sebagai iterasi kedua tanpa mengubah alur current weather yang sudah ada.
