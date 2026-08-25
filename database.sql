-- ========================================================
-- DATABASE SCHEMA FOR JEJAK SIM (XAMPP MySQL)
-- Import script ini via phpMyAdmin (http://localhost/phpmyadmin)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `db_jejak_sim` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_jejak_sim`;

-- 1. TABEL USERS (AKUN CUSTOMER & ADMIN)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  `name` VARCHAR(100) NOT NULL,
  `nik` VARCHAR(16) NULL,
  `no_hp` VARCHAR(20) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Akun Bawaan (Demo)
INSERT INTO `users` (`email`, `password`, `role`, `name`, `nik`, `no_hp`) VALUES
('satria@gmail.com', 'user123', 'customer', 'Satria', '3174052208900002', '081298765432'),
('budi@gmail.com', 'user123', 'customer', 'Budi Santoso', '3174052208900001', '081298765432'),
('raka@gmail.com', 'user123', 'customer', 'Raka Pratama', '9213917237217321', '085712345678'),
('dedi@gmail.com', 'user123', 'customer', 'Dedi Kurniawan', '3174052208900009', '081398765432'),
('admin@jejaksim.polri.go.id', 'admin123', 'admin', 'Petugas SATPAS Presisi', '3174000000000001', '081100009999')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `nik`=VALUES(`nik`), `no_hp`=VALUES(`no_hp`);

-- 2. TABEL SUBMISSIONS (PENGAJUAN SIM ONLINE)
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `resi_id` VARCHAR(50) NOT NULL UNIQUE,
  `user_email` VARCHAR(100) NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `nik` VARCHAR(16) NOT NULL,
  `no_hp` VARCHAR(20) NOT NULL,
  `jenis_sim` VARCHAR(30) NOT NULL,
  `satpas` VARCHAR(150) NOT NULL,
  `service_title` VARCHAR(150) NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Dummy Pengajuan
INSERT INTO `submissions` (`resi_id`, `user_email`, `nama`, `nik`, `no_hp`, `jenis_sim`, `satpas`, `service_title`, `status`) VALUES
('SIM-2026-8786', 'satria@gmail.com', 'Satria', '3174052208900002', '081298765432', 'SIM C', 'SATPAS Polres Metro Jakarta Timur', 'Pendaftaran SIM Baru', 'Pending'),
('SIM-2026-7866', 'budi@gmail.com', 'Budi Santoso', '3174052208900001', '081298765432', 'SIM A', 'SATPAS Polres Metro Jakarta Selatan', 'Perpanjangan SIM Nasional', 'Pending'),
('SIM-2026-0822-412', 'raka@gmail.com', 'Raka Pratama', '9213917237217321', '085712345678', 'SIM Internasional', 'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)', 'Pendaftaran SIM Internasional', 'Approved'),
('SIM-2026-0822-889', 'dedi@gmail.com', 'Dedi Kurniawan', '3174052208900009', '081398765432', 'SIM A', 'SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)', 'Perpanjangan SIM Nasional', 'Rejected')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`), `nama`=VALUES(`nama`), `nik`=VALUES(`nik`);

-- 3. TABEL SATPAS LOCATIONS
CREATE TABLE IF NOT EXISTS `satpas_locations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_satpas` VARCHAR(150) NOT NULL UNIQUE,
  `wilayah` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `satpas_locations` (`nama_satpas`, `wilayah`) VALUES
('SATPAS 1221 Daan Mogot, Jakarta Barat (Polda Metro Jaya)', 'DKI Jakarta'),
('SATPAS Polres Metro Jakarta Selatan', 'DKI Jakarta'),
('SATPAS Polres Metro Jakarta Timur', 'DKI Jakarta'),
('SATPAS Polres Metro Jakarta Pusat', 'DKI Jakarta'),
('SATPAS Polrestro Depok, Jawa Barat', 'Jawa Barat'),
('SATPAS Polresta Tangerang Kota, Banten', 'Banten'),
('SATPAS Polresta Tangerang Selatan, Banten', 'Banten'),
('SATPAS Polrestro Bekasi Kota, Jawa Barat', 'Jawa Barat'),
('SATPAS Polresta Bandung, Jawa Barat', 'Jawa Barat'),
('SATPAS Polrestabes Bandung, Jawa Barat', 'Jawa Barat'),
('SATPAS Polresta Bogor Kota, Jawa Barat', 'Jawa Barat'),
('SATPAS Polresta Cirebon, Jawa Barat', 'Jawa Barat'),
('SATPAS Polrestabes Semarang, Jawa Tengah', 'Jawa Tengah'),
('SATPAS Polresta Surakarta (Solo), Jawa Tengah', 'Jawa Tengah'),
('SATPAS Polresta Magelang, Jawa Tengah', 'Jawa Tengah'),
('SATPAS Polresta Yogyakarta (DIY)', 'D.I. Yogyakarta'),
('SATPAS Polrestabes Surabaya, Jawa Timur', 'Jawa Timur'),
('SATPAS Polresta Malang Kota, Jawa Timur', 'Jawa Timur'),
('SATPAS Polresta Sidoarjo, Jawa Timur', 'Jawa Timur'),
('SATPAS Polresta Denpasar, Bali', 'Bali'),
('SATPAS Polrestabes Medan, Sumatera Utara', 'Sumatera Utara'),
('SATPAS Polresta Pekanbaru, Riau', 'Riau'),
('SATPAS Polresta Palembang, Sumatera Selatan', 'Sumatera Selatan'),
('SATPAS Polrestabes Makassar, Sulawesi Selatan', 'Sulawesi Selatan'),
('SATPAS Polresta Balikpapan, Kalimantan Timur', 'Kalimantan Timur')
ON DUPLICATE KEY UPDATE `id`=`id`;
