# Referensi Konten & Desain: Aplikasi Serupa Digital Korlantas POLRI

> Sumber inspirasi: https://digitalkorlantas.polri.go.id/
> Catatan: dokumen ini adalah ringkasan fitur + panduan desain untuk membangun aplikasi **React Native** dengan gaya UI yang simpel, tidak terkesan "AI-generated", dan warna khas **biru navy**.

---

## 1. Identitas Aplikasi

- **Nama Aplikasi**: Digital Korlantas POLRI
- **Tagline**: "Stop Pelanggaran, Stop Kecelakaan! Keselamatan Untuk Kemanusiaan"
- **Deskripsi Singkat**: Aplikasi resmi dari Korlantas POLRI untuk memudahkan masyarakat mengakses layanan lalu lintas dalam satu aplikasi.
- **Platform Target**: React Native (Android & iOS)

---

## 2. Struktur Navigasi (Menu)

- Beranda
- Layanan
  - SIM Nasional
  - SIM Internasional
- FAQ
- Kebijakan Privasi
- Download / Tentang Aplikasi

> Untuk React Native, ini bisa dipetakan ke **Bottom Tab Navigator** (Beranda, Layanan, FAQ, Akun) + **Stack Navigator** di dalam tiap tab untuk halaman detail.

---

## 3. Fitur Aplikasi

### 3.1 SINAR (SIM Nasional Presisi)
| Layanan | Deskripsi |
|---|---|
| Pendaftaran SIM Nasional | Pendaftaran & ujian teori dilakukan online dari rumah; ujian praktik tetap dilakukan di SATPAS sesuai jadwal pilihan |
| Perpanjangan SIM Nasional | Perpanjangan online tanpa antre; SIM baru dikirim ke alamat rumah |

### 3.2 SIM Internasional
| Layanan | Deskripsi |
|---|---|
| Pendaftaran SIM Internasional | Proses verifikasi dokumen dilakukan digital; SIM dikirim setelah disetujui |
| Perpanjangan SIM Internasional | Unggah dokumen persyaratan + SIM lama; SIM baru dicetak & dikirim |

### 3.3 Fitur "Segera Hadir" (belum aktif di situs asli)
- **SIGNAL** (Samsat Digital Nasional)
- **NTMC POLRI** (National Traffic Management Center)
- **ETLE** (Electronic Traffic Law Enforcement)

---

## 4. Keunggulan / Value Proposition

1. **Digital ID** — identitas digital terenkripsi, representasi dari identitas fisik
2. **Biometric Authentication** — Face Recognition + Liveness, terintegrasi data E-KTP
3. **Proses Administrasi Lebih Cepat** — layanan terintegrasi secara daring
4. **Kemudahan Pembayaran** — mendukung berbagai metode pembayaran
5. **Tanpa Perlu Datang ke Kantor Layanan** — dokumen dikirim langsung ke rumah

---

## 5. Alur Penggunaan

1. **Download** — unduh aplikasi via Play Store / App Store
2. **Registrasi** — daftar dengan nomor ponsel, verifikasi email & identitas (KTP)
3. **Siap Digunakan** — seluruh layanan langsung dapat diakses

---

## 6. FAQ (Referensi Pertanyaan)

1. Apa itu aplikasi ini?
2. Apa saja fitur yang tersedia?
3. Bagaimana cara mendownload dan registrasi?
4. Apa saja kelebihan dibanding cara manual/offline?
5. Bagaimana cara mendapat bantuan jika ada kendala teknis?

---

## 7. Ide Modifikasi Konten (Agar Tidak Identik dengan Aslinya)

- **Ganti konteks instansi**: sesuaikan dengan objek layanan project kamu (akademik, desa, organisasi, dll.)
- **Ganti daftar fitur**: jumlah & nama layanan menyesuaikan kebutuhan, tidak harus 5 seperti aslinya
- **Ganti keunggulan**: fokus pada value proposition yang relevan (kecepatan, keamanan, dukungan, dll.)
- **Tambahkan section baru**, misalnya: statistik pengguna, roadmap fitur, panduan video
- **FAQ**: buat pertanyaan sesuai use case aplikasi sendiri

---

## 8. Tech Stack

- **Framework**: React Native (disarankan pakai Expo untuk kemudahan development)
- **Navigasi**: React Navigation (Bottom Tabs + Native Stack)
- **State**: Context API / Zustand (hindari Redux kalau scope kecil)
- **Styling**: StyleSheet biasa atau NativeWind (Tailwind untuk RN) — pilih satu, jangan campur biar konsisten

---

## 9. Panduan Desain UI — Simpel & Tidak "Terasa AI"

Prinsip utama: **flat, minim dekorasi, jelas hierarkinya**. Hindari ciri khas UI yang terasa dibuat AI:

**Hindari:**
- Gradient warna-warni berlebihan (terutama ungu-ke-biru khas AI)
- Glassmorphism / blur berlebihan di card
- Shadow tebal di semua elemen
- Emoji sebagai pengganti icon
- Rounded corner ekstrem di semua elemen (radius seragam berlebihan)
- Font decorative / terlalu banyak variasi ukuran font

**Terapkan:**
- Layout flat dengan whitespace yang cukup
- Satu warna aksen dominan (navy) + netral (putih/abu)
- Icon set konsisten (mis. Feather Icons / Ionicons via `react-native-vector-icons`), bukan emoji
- Border tipis (1px) sebagai pemisah, bukan shadow tebal
- Tipografi terbatas: 1 font family, 3–4 ukuran saja (heading, subheading, body, caption)

### Palet Warna — Navy

| Nama | Hex | Penggunaan |
|---|---|---|
| Navy (Primary) | `#0A2540` | Header, tombol utama, teks penting |
| Navy Soft | `#1E3A5F` | Elemen sekunder, background card aktif |
| Navy Muted | `#3B5A80` | Border, ikon nonaktif |
| Background | `#F5F7FA` | Latar layar utama |
| Surface / Card | `#FFFFFF` | Background card/list item |
| Text Primary | `#1A1A1A` | Teks utama |
| Text Secondary | `#6B7280` | Teks deskripsi, caption |
| Border | `#E2E5EA` | Garis pemisah, outline input |
| Success | `#2E7D5B` | Status berhasil (opsional, tetap netral bukan hijau terang) |
| Warning/Error | `#B3261E` | Status gagal/peringatan |

### Struktur Halaman (disederhanakan dari situs asli)

1. **Header** — logo + judul aplikasi, flat, background navy solid (bukan gradient)
2. **Beranda**: daftar layanan dalam bentuk **list/card sederhana** (icon kiri, judul, deskripsi singkat, chevron kanan) — bukan grid warna-warni
3. **Detail Layanan**: judul + deskripsi + tombol aksi (CTA) berwarna navy solid, teks putih
4. **Keunggulan**: list vertikal sederhana (icon + teks), bukan card mengambang dengan shadow besar
5. **FAQ**: accordion sederhana, border tipis sebagai pemisah antar item
6. **Footer/Akun**: link ke kebijakan privasi, kontak bantuan, versi aplikasi

### Contoh Referensi Komponen RN (struktur, bukan kode penuh)

```
components/
  Header.tsx          -> background navy solid, judul + optional back button
  ServiceCard.tsx      -> icon + title + subtitle, border bawah tipis, no shadow
  PrimaryButton.tsx    -> background navy (#0A2540), radius kecil (6-8px), no gradient
  SectionTitle.tsx      -> heading sederhana, uppercase kecil, letter-spacing
  FAQItem.tsx          -> accordion flat, border tipis
screens/
  HomeScreen.tsx
  ServiceDetailScreen.tsx
  FAQScreen.tsx
  AboutScreen.tsx
```

**Catatan penting**: karena target React Native, mockup visual tidak bisa dijalankan langsung di sini (artifact hanya mendukung React untuk web). File ini jadi acuan desain (warna, komponen, struktur) yang bisa diimplementasikan langsung di kode RN.