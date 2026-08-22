# Walkthrough - Implementasi Fitur Rincian Biaya Transparan & Pos Indonesia Delivery Flow

Seluruh fitur berdasarkan 3 tangkapan layar spesifikasi resmi SIM Presisi telah **berhasil diimplementasikan 100%**:

---

## 🛠️ Fitur Customer & Sistem Biaya Transparan (Screenshot 1 & 2):

1. **Tabel Rincian Biaya Transparan (Presisi Gambar 1)**:
   - **Biaya Layanan (PNBP)**: Rp 120.000 (SIM A Baru, Tarif resmi negara).
   - **Biaya Admin Platform**: Rp 15.000 (Biaya jasa aplikasi).
   - **Biaya Payment Gateway**: Rp 5.000 (Fasilitas Xendit/Midtrans fee).
   - **Subtotal**: Rp 140.000.
   - **PPN 11%**: Rp 15.400 (11% × Subtotal).
   - **Ongkir Pos Indonesia**: Rp 0 (Ambil di SATPAS) / Rp 30.000 (Dikirim ke rumah).
   - **Total Bayar**: **Rp 155.400** (Ambil Sendiri) / **Rp 185.400** (Kirim ke Rumah).

2. **Metode Pengambilan & Form Alamat Pengiriman (Screenshot 2)**:
   - Pilihan Radio button: `Ambil Sendiri di SATPAS` (Bebas Ongkir) vs `Dikirim ke Rumah via Pos Indonesia` (+ Ongkir).
   - Form Alamat Pengiriman (Alamat Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi, Kode Pos).

3. **Tracking Status Pengiriman Live (Pos Indonesia)**:
   - Nomor Resi Pos Indonesia (misal: `POS-SIM-2026-9921`).
   - Timeline 5 Tahap Pengiriman (`Isi Data` ➔ `Verifikasi POLRI` ➔ `Bayar Lunas` ➔ `SIM Dicetak di SATPAS` ➔ `Dalam Pengiriman Kurir Pos`).

4. **Cetak & Download Invoice PDF**:
   - Modal preview Invoice resmi ber-stempel KORLANTAS POLRI dengan tombol `DOWNLOAD / CETAK INVOICE PDF` (cetak / simpan PDF via browser `window.print()`).

---

## ⚙️ Fitur Panel Admin Verifikator (Screenshot 3):

1. **Kelola Pengiriman & Input Resi Pos**:
   - Admin dapat memasukkan nomor Resi Pos Indonesia (`POS-SIM-2026-XXXX`) dan mengubah status kurir (`Diproses di SATPAS` ➔ `Diserahkan ke Kurir Pos` ➔ `Dalam Pengiriman` ➔ `Diterima Pemohon`).
2. **Pengaturan Tarif & Ongkir per Zona (Dynamic Config)**:
   - Admin dapat mengatur tarif PNBP per jenis SIM, Biaya Admin Platform (Rp 15.000), Biaya Payment Gateway (Rp 5.000), PPN (11%), serta tarif ongkos kirim untuk 4 Zona Wilayah Indonesia.
3. **Laporan Keuangan & Export Excel (.CSV)**:
   - Ringkasan pendapatan PNBP, Admin Fee, PPN 11%, dan Ongkir Pos.
   - Tombol **Export Excel / CSV** yang langsung mendownload file `.csv` laporan keuangan transaksi.
4. **Manajemen Alamat Bermasalah**:
   - Filter alamat pengiriman yang kurang lengkap dengan tombol **Hubungi via WA** langsung ke WhatsApp pemohon.

---

## 🧪 Verifikasi & Kompilasi
- **Expo Web Build**: Terverifikasi sukses `Web Bundled 4665ms index.js (286 modules)` tanpa error.
