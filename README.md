# Weather App — Tugas Rutin 5 (Pemrograman Web)

Aplikasi cuaca menggunakan **Vite + Vanilla JavaScript (ES6+) + Tailwind CSS** dengan data dari **OpenWeatherMap API** dan deployment melalui **Cloudflare Workers**.

## Fitur

- Pencarian cuaca berdasarkan nama kota
- Informasi suhu, feels-like, deskripsi, ikon, kelembaban, tekanan udara, angin, visibility, sunrise, sunset, serta suhu minimum dan maksimum
- Forecast cuaca 3 jam berikutnya
- Penanganan error untuk kota tidak ditemukan, error jaringan, dan error API
- Loading state dengan skeleton
- Riwayat pencarian menggunakan LocalStorage, maksimal 5 kota dan tanpa duplikat
- Halaman History terpisah dengan fitur pencarian ulang dan hapus semua riwayat
- Search suggestion berdasarkan riwayat pencarian
- Navigasi suggestion menggunakan keyboard
- Toggle satuan suhu °C / °F tanpa fetch ulang
- Tautan lokasi kota ke Google Maps berdasarkan koordinat hasil API
- Layout responsif untuk desktop, tablet, dan mobile
- Deployment sebagai Cloudflare Worker dengan static assets

## Menjalankan secara lokal

1. Clone repository ini.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Salin `.env.example` menjadi `.env`, lalu isi API key OpenWeatherMap:
   ```env
   VITE_API_KEY=xxxxxxxxxxxxxxxx
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

Hasil build dibuat di folder `dist/`.

## Deploy ke Cloudflare Workers

Project menggunakan `@cloudflare/vite-plugin` dan Wrangler.

```bash
npm run build
npx wrangler deploy
```

Jika menggunakan Cloudflare Workers Builds, gunakan:

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`

Variable `VITE_API_KEY` harus tersedia sebagai build variable/secret di Cloudflare. Jangan memasukkan API key asli ke repository.

## Environment Variable

File `.env` digunakan untuk API key lokal dan diabaikan oleh Git.

File `.env.example` hanya menjadi template:

```env
VITE_API_KEY=
```

## Struktur Proyek

```text
src/
├── main.js               # entry point dan wiring aplikasi
├── style.css             # styling aplikasi
├── api/
│   └── weather.js        # request current weather dan forecast
├── ui/
│   ├── render.js          # rendering weather, forecast, dan history
│   └── state.js           # state tampilan loading, error, empty, dan weather
└── utils/
    ├── storage.js         # riwayat pencarian di LocalStorage
    ├── convert.js         # konversi °C ↔ °F
    └── format.js          # formatting data cuaca
```

## Cloudflare Configuration

- `vite.config.js` menggunakan `@cloudflare/vite-plugin`.
- `wrangler.jsonc` mengatur Worker `asgardweather` dan static assets.
- `.wrangler/`, `dist/`, `node_modules/`, `.env`, dan file log diabaikan oleh Git.
