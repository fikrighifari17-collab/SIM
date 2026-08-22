# Panduan Keamanan Website dari Serangan Hacker — JEJAK SIM

Dokumen panduan standar keamanan siber (*Cyber Security & Systems Hardening Guide*) untuk perlindungan data pemohon SIM Online dari ancaman serangan peretasan (hacking).

---

## 1. Autentikasi & Otorisasi
- **Password Hashing**: Tidak pernah menyimpan password dalam bentuk plain text. Gunakan `bcrypt` (work factor >= 12) atau `Argon2id`.
- **Multi-Factor Authentication (MFA)**: Wajibkan 2FA/MFA berbasis TOTP (Google Authenticator) untuk akun dengan hak akses tinggi (Admin / Verifikator).
- **Prinsip Least Privilege**: Setiap role pengguna (Customer vs Admin) hanya diberikan hak akses minimal sesuai fungsinya.
- **Manajemen Sesi yang Aman**: Token JWT dengan masa berlaku singkat (*expiry*), auto-logout saat *idle*, serta invalidasi sesi lama setelah login di perangkat baru.

---

## 2. Validasi & Sanitasi Input (Server-Side)
- **Zero-Trust Input**: Semua input dari pengguna wajib divalidasi dan disanitasi ketat di sisi **server-side**, bukan hanya client-side.
- **Pencegahan SQL Injection**: Gunakan *Prepared Statements* / *Parameterized Queries* pada ORM (Prisma/TypeORM/Sequelize), hindari konkat string SQL manual.
- **Pencegahan XSS (Cross-Site Scripting)**: Lakukan *output escaping / HTML encoding* pada semua data buatan user sebelum dirender di browser.
- **Pencegahan CSRF**: Terapkan token CSRF (*Anti-CSRF Tokens*) dan cookie bertipe `SameSite=Strict`.
- **Keamanan File Upload**: Validasi ekstensi (MIME type check), batasi ukuran file, acak nama file, dan simpan di folder non-executable (*cloud storage / S3*).

---

## 3. Enkripsi Data & Variabel Lingkungan
- **HTTPS / TLS 1.3 In Transit**: Wajibkan seluruh lalu lintas komunikasi menggunakan HTTPS terenkripsi.
- **Encryption at Rest**: Enkripsi data sensitif (NIK, foto identitas) saat disimpan di database.
- **Environment Variables (`.env`)**: Simpan seluruh API keys, database credentials, dan secret keys dalam file `.env` dan pastikan terdaftar di `.gitignore`.

---

## 4. Manajemen API & Protection Endpoint
- **Rate Limiting**: Terapkan pembatasan *request rate* (contoh: 5 percobaan login per menit) untuk mencegah serangan *brute force* dan DDoS.
- **JWT Expiration**: Gunakan *Short-lived Access Token* (misal 15 menit) + *Refresh Token* dengan rotasi berkala.
- **Error Handling Aman**: Sembunyikan pesan error internal, *stack trace*, atau versi library dari pengguna publik.
- **REST Method Restriction**: Restriksi method HTTP yang diizinkan (`GET`, `POST`, `PUT`, `DELETE`) secara eksplisit per endpoint.

---

## 5. Audit Dependency & Infrastruktur Server
- **Manajemen Dependency**: Jalankan `npm audit` atau Snyk secara berkala untuk memperbarui library yang memiliki kerentanan (*vulnerabilities*).
- **Web Application Firewall (WAF)**: Pasang Cloudflare / AWS WAF untuk menyaring *traffic* berbahaya.
- **Hardening Server**: Tutup port yang tidak digunakan, matikan *directory listing*, dan batasi akses SSH menggunakan *keypair authentication*.

---

## 6. Praktik Pengembangan Aman (Secure SDLC)
- **Security by Design**: Pertimbangkan faktor keamanan sejak tahap perancangan arsitektur awal.
- **Code Review & SAST**: Lakukan analisis statis kode sebelum digabungkan (*merge*) ke branch utama.
- **Penetration Testing**: Lakukan uji coba peretasan berkala (*vulnerability scanning*) secara terjadwal.
- **Logging & Monitoring**: Aktifkan audit log untuk merekam percobaan login abnormal atau aktivitas mencurigakan.

---

## 7. Header Keamanan HTTP (HTTP Security Headers)
- `Content-Security-Policy` (CSP): Membatasi eksekusi script dan sumber asset hanya dari domain tepercaya.
- `X-Frame-Options: DENY`: Mencegah serangan *clickjacking* pada iframe.
- `X-Content-Type-Options: nosniff`: Mencegah browser melakukan *MIME sniffing*.
- `Strict-Transport-Security` (HSTS): Memaksa browser menggunakan HTTPS secara otomatis.
