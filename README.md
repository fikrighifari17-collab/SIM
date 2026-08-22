# SIM Digital — Korlantas POLRI

Aplikasi layanan SIM (Surat Izin Mengemudi) digital terinspirasi dari platform resmi Korlantas POLRI. Dibangun sebagai **monorepo** yang berisi aplikasi web dan mobile Android.

---

## Struktur Monorepo

```
SIM/
├── src/              → Web App (React Native for Web + Expo)
├── server/           → Backend REST API (Node.js + Express + MySQL)
├── android/          → Mobile App Android (React Native + Expo SDK 57)
├── public/           → Static assets web
├── database.sql      → Schema & seed database MySQL
└── README.md
```

---

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Web Frontend | React Native for Web + Expo |
| Backend API | Node.js + Express.js |
| Database | MySQL (via XAMPP) |
| Mobile Android | React Native + Expo SDK 57 |
| State Management | Zustand |
| Storage Aman | expo-secure-store |
| HTTP Client | Axios |
| Navigasi | React Navigation (Stack + Bottom Tab) |

---

## Fitur Utama

- **SINAR** — Pendaftaran & perpanjangan SIM A/C secara online
- **SIM Internasional** — Registrasi & perpanjangan SIM Internasional
- **Verifikasi Wajah** — Liveness check via kamera (face detection)
- **Upload Dokumen** — KTP, SIM lama, foto diri, hasil tes kesehatan & psikologi
- **Cek Status** — Pantau status pengajuan (Pending / Approved / Rejected)
- **Pembayaran** — Virtual Account BNI
- **Admin Dashboard** — Kelola & verifikasi pengajuan (web only)

---

## Persyaratan Sistem

- Node.js v18+
- XAMPP (MySQL)
- Expo Go SDK 57 (Android) atau Expo Go terbaru
- npm atau yarn

---

## Setup & Menjalankan

### 1. Database

Pastikan XAMPP sudah berjalan dan MySQL aktif, lalu import schema:

```bash
# Via MySQL CLI
mysql -u root < database.sql

# Atau import manual via phpMyAdmin:
# http://localhost/phpmyadmin → Import → pilih database.sql
```

Database yang dibuat: `db_jejak_sim`
- Tabel `users` — akun customer & admin
- Tabel `submissions` — data pengajuan SIM
- Tabel `satpas_locations` — 25 lokasi SATPAS

---

### 2. Backend API

```bash
cd server
npm install
node index.js
```

Server berjalan di `http://localhost:5000`

Output sukses:
```
🚀 Server Backend JEJAK SIM Berjalan di http://localhost:5000
✅ Berhasil terhubung ke XAMPP MySQL Database (db_jejak_sim)
```

**Environment variables** (`server/.env`):
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_jejak_sim
```

---

### 3. Web App

```bash
# Di root folder
npm install
npx expo start --web
```

Web berjalan di `http://localhost:8081` (atau port lain jika bentrok)

---

### 4. Android (Mobile)

```bash
cd android
npm install
npx expo start --lan
```

Lalu scan QR code menggunakan **Expo Go SDK 57** di HP.

> Download Expo Go SDK 57:
> https://expo.dev/go?sdkVersion=57&platform=android&device=true

**Penting:** Ganti IP di `android/src/services/api.ts` sesuai IP laptop kamu:
```ts
const BASE_URL = __DEV__
  ? 'http://192.168.x.x:5000/api'   // ← ganti dengan IP laptop kamu (cek via ipconfig)
  : 'https://your-production-api.com/api';
```

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/login` | Login customer/admin |
| POST | `/api/auth/register` | Registrasi akun baru |
| GET | `/api/submissions` | Ambil semua pengajuan |
| POST | `/api/submissions` | Buat pengajuan baru |
| PATCH | `/api/submissions/:id/status` | Update status (admin) |
| GET | `/api/satpas` | Daftar lokasi SATPAS |

---

## Validasi Input

### Register
| Field | Aturan |
|---|---|
| Nama | Huruf saja, 2–100 karakter |
| Email | Format email valid, unik |
| NIK | Tepat 16 digit angka |
| No HP | 10–15 digit angka |
| Password | Minimal 8 karakter |

---

## Struktur Android

```
android/
├── App.tsx                    → Entry point
├── src/
│   ├── constants/colors.ts    → Palet warna (sama dengan web)
│   ├── types/index.ts         → TypeScript types & navigation params
│   ├── services/api.ts        → Axios HTTP client
│   ├── store/authStore.ts     → Zustand auth state
│   ├── navigation/
│   │   ├── index.tsx          → Root navigator
│   │   ├── AuthNavigator.tsx  → Stack: Login, Register
│   │   ├── MainNavigator.tsx  → Bottom tab: Home, Layanan, Status, Profil
│   │   └── ServicesStack.tsx  → Stack layanan lengkap
│   └── screens/
│       ├── HomeScreen.tsx
│       ├── LoginScreen.tsx
│       ├── RegisterScreen.tsx
│       ├── ServicesScreen.tsx
│       ├── ServiceDetailScreen.tsx
│       ├── SubmissionFormScreen.tsx
│       ├── LivenessCheckScreen.tsx
│       ├── DocumentUploadScreen.tsx
│       ├── PaymentScreen.tsx
│       ├── StatusScreen.tsx
│       └── ProfileScreen.tsx
```

---

## Kontribusi

| Bagian | Penanggung Jawab |
|---|---|
| Web Frontend | Fikri Ghifari |
| Backend API | Dzaki Awaludin |
| Android Mobile | Dzaki Awaludin |

---

## Catatan Keamanan

- Token autentikasi disimpan di `expo-secure-store` (encrypted)
- Password wajib di-hash menggunakan bcrypt sebelum production
- Implementasi JWT diperlukan sebelum deploy ke production
- File `.env` tidak boleh di-commit ke repository

---

## Lisensi

Proyek ini dibuat untuk keperluan akademis.
