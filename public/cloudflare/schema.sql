-- Tabel untuk menyimpan data user (device)
DROP TABLE IF EXISTS database_user;
CREATE TABLE database_user (
  device_id TEXT PRIMARY KEY,
  jumlah_kunjungan INTEGER DEFAULT 1,
  os TEXT,
  browser TEXT,
  tipe_perangkat TEXT,
  user_agent_original TEXT,
  nama_lengkap TEXT,
  nomor_telepon TEXT,
  detail_alamat TEXT,
  patokan TEXT,
  lat TEXT,
  lng TEXT
);

-- Tabel untuk log kunjungan mendetail
DROP TABLE IF EXISTS log;
CREATE TABLE log (
  id_log INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT,
  waktu DATETIME DEFAULT CURRENT_TIMESTAMP
);
