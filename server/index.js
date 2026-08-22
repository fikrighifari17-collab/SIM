const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi Koneksi MySQL XAMPP
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_jejak_sim',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Tes Koneksi Database saat Server Startup
dbPool.getConnection()
  .then((conn) => {
    console.log('✅ Berhasil terhubung ke XAMPP MySQL Database (db_jejak_sim)');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ Gagal terhubung ke MySQL XAMPP:', err.message);
  });

// 1. API LOGIN (CUSTOMER & ADMIN)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await dbPool.execute(
      'SELECT id, email, role, name, nik, no_hp FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau Password salah!' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. API REGISTRASI AKUN BARU
app.post('/api/auth/register', async (req, res) => {
  const { name, nik, noHp, email, password } = req.body;

  // Validasi wajib
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password minimal 8 karakter.' });
  }
  if (nik && !/^\d{16}$/.test(nik)) {
    return res.status(400).json({ success: false, message: 'NIK harus 16 digit angka.' });
  }
  if (noHp && !/^\d{10,15}$/.test(noHp)) {
    return res.status(400).json({ success: false, message: 'Nomor HP tidak valid (10–15 digit angka).' });
  }
  if (!/^[a-zA-Z\s'.,-]{2,100}$/.test(name.trim())) {
    return res.status(400).json({ success: false, message: 'Nama tidak valid. Gunakan huruf saja.' });
  }

  try {
    const [existing] = await dbPool.execute('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    const [result] = await dbPool.execute(
      'INSERT INTO users (email, password, role, name, nik, no_hp) VALUES (?, ?, ?, ?, ?, ?)',
      [email.toLowerCase(), password, 'customer', name.trim(), nik || null, noHp || null]
    );

    const newUser = { id: result.insertId, email: email.toLowerCase(), role: 'customer', name: name.trim(), nik: nik || null, no_hp: noHp || null };
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. API Dapatkan Semua Pengajuan (Admin/Customer)
app.get('/api/submissions', async (req, res) => {
  try {
    const [rows] = await dbPool.execute(
      'SELECT id, resi_id AS resiId, nama, nik, no_hp AS noHp, user_email AS email, jenis_sim AS jenisSim, satpas, service_title AS serviceTitle, DATE_FORMAT(created_at, "%d/%m/%Y") AS date, status FROM submissions ORDER BY id DESC'
    );
    res.json({ success: true, submissions: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. API Tambah Pengajuan SIM Baru
app.post('/api/submissions', async (req, res) => {
  const { resiId, nama, nik, noHp, email, jenisSim, satpas, serviceTitle } = req.body;
  try {
    await dbPool.execute(
      'INSERT INTO submissions (resi_id, user_email, nama, nik, no_hp, jenis_sim, satpas, service_title, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [resiId, email, nama, nik, noHp, jenisSim, satpas, serviceTitle, 'Pending']
    );
    res.json({ success: true, message: 'Pengajuan berhasil disimpan ke MySQL!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. API Update Status Verification (Setujui / Tolak oleh Admin)
app.patch('/api/submissions/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await dbPool.execute('UPDATE submissions SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: `Status pengajuan diubah menjadi ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. API Dapatkan 25 Lokasi SATPAS
app.get('/api/satpas', async (req, res) => {
  try {
    const [rows] = await dbPool.execute('SELECT nama_satpas, wilayah FROM satpas_locations ORDER BY id ASC');
    res.json({ success: true, satpas: rows.map(r => r.nama_satpas) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server Backend JEJAK SIM Berjalan di http://localhost:${PORT}`);
});
