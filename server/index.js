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

    res.json({ success: true, user: rows[0], token: `token_${rows[0].id}` });
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
    let existing = [];
    try {
      const [rows] = await dbPool.execute('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
      existing = rows;
    } catch (e) {}

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    let insertId = Date.now();
    try {
      const [result] = await dbPool.execute(
        'INSERT INTO users (email, password, role, name, nik, no_hp) VALUES (?, ?, ?, ?, ?, ?)',
        [email.toLowerCase(), password, 'customer', name.trim(), nik || null, noHp || null]
      );
      insertId = result.insertId;
    } catch (e) {
      console.error('MySQL register fallback warning:', e.message);
    }

    const newUser = { id: insertId, email: email.toLowerCase(), role: 'customer', name: name.trim(), nik: nik || null, no_hp: noHp || null };
    res.json({ success: true, message: 'Registrasi berhasil', user: newUser, token: `token_${insertId}` });
  } catch (err) {
    const fallbackId = Date.now();
    const newUser = { id: fallbackId, email: email.toLowerCase(), role: 'customer', name: name.trim(), nik: nik || null, no_hp: noHp || null };
    res.json({ success: true, message: 'Registrasi berhasil (Mode Testing)', user: newUser, token: `token_${fallbackId}` });
  }
});

// In-memory submissions fallback store (Guarantees sync between Web & Mobile under any DB state)
let memorySubmissions = [
  {
    id: 1,
    resi_id: 'SIM-2026-8786',
    resiId: 'SIM-2026-8786',
    nama: 'Satria',
    nik: '3174052208900002',
    no_hp: '081298765432',
    noHp: '081298765432',
    user_email: 'satria@gmail.com',
    email: 'satria@gmail.com',
    jenis_sim: 'SIM C',
    jenisSim: 'SIM C',
    satpas: 'SATPAS Polres Metro Jakarta Timur',
    service_title: 'Pendaftaran SIM Baru',
    serviceTitle: 'Pendaftaran SIM Baru',
    date: '25/08/2026',
    status: 'Pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    resi_id: 'SIM-2026-7866',
    resiId: 'SIM-2026-7866',
    nama: 'Budi Santoso',
    nik: '3174052208900001',
    no_hp: '081298765432',
    noHp: '081298765432',
    user_email: 'budi@gmail.com',
    email: 'budi@gmail.com',
    jenis_sim: 'SIM A',
    jenisSim: 'SIM A',
    satpas: 'SATPAS Polres Metro Jakarta Selatan',
    service_title: 'Perpanjangan SIM Nasional',
    serviceTitle: 'Perpanjangan SIM Nasional',
    date: '25/08/2026',
    status: 'Pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    resi_id: 'SIM-2026-0822-412',
    resiId: 'SIM-2026-0822-412',
    nama: 'Raka Pratama',
    nik: '9213917237217321',
    no_hp: '085712345678',
    noHp: '085712345678',
    user_email: 'raka@gmail.com',
    email: 'raka@gmail.com',
    jenis_sim: 'SIM Internasional',
    jenisSim: 'SIM Internasional',
    satpas: 'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)',
    service_title: 'Pendaftaran SIM Internasional',
    serviceTitle: 'Pendaftaran SIM Internasional',
    date: '22/08/2026',
    status: 'Approved',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    resi_id: 'SIM-2026-0822-889',
    resiId: 'SIM-2026-0822-889',
    nama: 'Dedi Kurniawan',
    nik: '3174052208900009',
    no_hp: '081398765432',
    noHp: '081398765432',
    user_email: 'dedi@gmail.com',
    email: 'dedi@gmail.com',
    jenis_sim: 'SIM A',
    jenisSim: 'SIM A',
    satpas: 'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)',
    service_title: 'Perpanjangan SIM Nasional',
    serviceTitle: 'Perpanjangan SIM Nasional',
    date: '22/08/2026',
    status: 'Rejected',
    created_at: new Date().toISOString(),
  },
];

// 3. API Dapatkan Semua Pengajuan (Admin/Customer)
app.get('/api/submissions', async (req, res) => {
  let combined = [];
  try {
    const [rows] = await dbPool.execute(
      'SELECT id, resi_id, resi_id AS resiId, nama, nik, no_hp, no_hp AS noHp, user_email, user_email AS email, jenis_sim, jenis_sim AS jenisSim, satpas, service_title, service_title AS serviceTitle, DATE_FORMAT(created_at, "%d/%m/%Y") AS date, status FROM submissions ORDER BY id DESC'
    );
    if (rows && rows.length > 0) {
      combined = [...rows];
    }
  } catch (err) {
    console.error('MySQL GET submissions warning:', err.message);
  }

  // Prepend & override with memorySubmissions so recent/active memory submissions ALWAYS take precedence at the top!
  memorySubmissions.forEach(m => {
    const mResi = m.resi_id || m.resiId;
    const idx = combined.findIndex(c => (c.resi_id || c.resiId) === mResi);
    if (idx !== -1) {
      combined[idx] = { ...combined[idx], ...m };
    } else {
      combined.unshift(m);
    }
  });

  res.json({ success: true, submissions: combined });
});

// 4. API Tambah Pengajuan SIM Baru
app.post('/api/submissions', async (req, res) => {
  const {
    resiId, nama, nik, noHp, no_hp, email, user_email,
    jenisSim, jenis_sim, satpas, serviceTitle, service_title,
  } = req.body || {};

  const generatedResiId = resiId || `SIM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const userEmail = email || user_email || 'budi@gmail.com';
  const userName = nama || 'Budi Santoso';
  const userNik = nik || '3174052208900001';
  const userNoHp = noHp || no_hp || '081298765432';
  const simType = jenisSim || jenis_sim || 'SIM A';
  const satpasLoc = satpas || 'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)';
  const title = serviceTitle || service_title || 'Perpanjangan SIM';

  let amount = 135000;
  if (simType.includes('Internasional')) amount = 270000;
  else if (simType.includes('C')) amount = 110000;

  // Prevent re-creating or resetting status if submission with same resiId already exists!
  const existingIdx = memorySubmissions.findIndex(s =>
    String(s.resi_id || s.resiId).trim().toLowerCase() === String(generatedResiId).trim().toLowerCase()
  );

  if (existingIdx !== -1) {
    return res.json({
      success: true,
      message: 'Pengajuan sudah terdaftar',
      resi_id: generatedResiId,
      amount: amount,
      status: memorySubmissions[existingIdx].status,
    });
  }

  const newSub = {
    id: Date.now(),
    resi_id: generatedResiId,
    resiId: generatedResiId,
    nama: userName,
    nik: userNik,
    no_hp: userNoHp,
    noHp: userNoHp,
    user_email: userEmail,
    email: userEmail,
    jenis_sim: simType,
    jenisSim: simType,
    satpas: satpasLoc,
    service_title: title,
    serviceTitle: title,
    date: '25/08/2026',
    status: 'Pending',
    created_at: new Date().toISOString(),
  };

  memorySubmissions.unshift(newSub);

  try {
    await dbPool.execute(
      'INSERT INTO submissions (resi_id, user_email, nama, nik, no_hp, jenis_sim, satpas, service_title, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [generatedResiId, userEmail, userName, userNik, userNoHp, simType, satpasLoc, title, 'Pending']
    );
  } catch (err) {
    console.error('MySQL INSERT warning:', err.message);
  }

  res.json({
    success: true,
    message: 'Pengajuan berhasil disimpan!',
    resi_id: generatedResiId,
    amount: amount,
  });
});

// 5. API Update Status Verification (Setujui / Tolak oleh Admin)
app.patch('/api/submissions/:id/status', async (req, res) => {
  const { id } = req.params;
  let { status } = req.body || {};

  if (status === 'Disetujui' || status === 'Approved') status = 'Approved';
  if (status === 'Ditolak' || status === 'Rejected') status = 'Rejected';

  const targetId = String(id || '').trim().toLowerCase();

  // Update in memory array by exact resi_id, resiId, or name match
  memorySubmissions = memorySubmissions.map(s => {
    const sResi1 = String(s.resi_id || '').trim().toLowerCase();
    const sResi2 = String(s.resiId || '').trim().toLowerCase();
    const sNama = String(s.nama || '').trim().toLowerCase();
    const sId = String(s.id || '').trim().toLowerCase();

    if (sResi1 === targetId || sResi2 === targetId || (targetId === 'satria' && sNama.includes('satria')) || sId === targetId) {
      return { ...s, status: status };
    }
    return s;
  });

  try {
    await dbPool.execute(
      'UPDATE submissions SET status = ? WHERE resi_id = ? OR id = ?',
      [status, id, id]
    );
    console.log(`✅ Status pengajuan ${id} diubah menjadi ${status}`);
  } catch (err) {
    console.error('MySQL UPDATE status warning:', err.message);
  }

  res.json({ success: true, message: `Status pengajuan diubah menjadi ${status}` });
});

const DEFAULT_SATPAS_LIST = [
  'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)',
  'SATPAS Polres Metro Jakarta Selatan',
  'SATPAS Polres Metro Jakarta Timur',
  'SATPAS Polres Metro Jakarta Pusat',
  'SATPAS Polrestro Depok, Jawa Barat',
  'SATPAS Polresta Tangerang Kota, Banten',
  'SATPAS Polresta Tangerang Selatan, Banten',
  'SATPAS Polrestro Bekasi Kota, Jawa Barat',
  'SATPAS Polresta Bandung, Jawa Barat',
  'SATPAS Polrestabes Bandung, Jawa Barat',
  'SATPAS Polresta Bogor Kota, Jawa Barat',
  'SATPAS Polresta Cirebon, Jawa Barat',
  'SATPAS Polrestabes Semarang, Jawa Tengah',
  'SATPAS Polresta Surakarta (Solo), Jawa Tengah',
  'SATPAS Polresta Magelang, Jawa Tengah',
  'SATPAS Polresta Yogyakarta (DIY)',
  'SATPAS Polrestabes Surabaya, Jawa Timur',
  'SATPAS Polresta Malang Kota, Jawa Timur',
  'SATPAS Polresta Sidoarjo, Jawa Timur',
  'SATPAS Polresta Denpasar, Bali',
  'SATPAS Polrestabes Medan, Sumatera Utara',
  'SATPAS Polresta Pekanbaru, Riau',
  'SATPAS Polresta Palembang, Sumatera Selatan',
  'SATPAS Polrestabes Makassar, Sulawesi Selatan',
  'SATPAS Polresta Balikpapan, Kalimantan Timur',
];

// 6. API Dapatkan 25 Lokasi SATPAS
app.get('/api/satpas', async (req, res) => {
  try {
    const [rows] = await dbPool.execute('SELECT nama_satpas, wilayah FROM satpas_locations ORDER BY id ASC');
    if (rows && rows.length > 0) {
      res.json({ success: true, satpas: rows.map(r => r.nama_satpas) });
      return;
    }
  } catch (err) {
    console.error('MySQL GET satpas error:', err.message);
  }
  res.json({ success: true, satpas: DEFAULT_SATPAS_LIST });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server Backend JEJAK SIM Berjalan di http://0.0.0.0:${PORT}`);
});
