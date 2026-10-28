// seed.js
// Mengisi basis data dengan 3 Klub dan 25 Player. 
// Aman dijalankan berulang: data lama akan dihapus terlebih dahulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

// ======================================================
// 1. DEFINISI SCHEMA & MODEL (Sama dengan di app.js)
// ======================================================
const klubSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  kota: String,
  stadion: String
});
const Klub = mongoose.model('Klub', klubSchema);

const playerSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  klub_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Klub', required: true },
  posisi: { type: String, required: true, enum: ["kiper", "bek", "gelandang", "penyerang"] },
  nomorPunggung: { type: Number, required: true },
  kewarganegaraan: { type: String, default: "Indonesia" }
}, { timestamps: true });
const Player = mongoose.model('Player', playerSchema);

// ======================================================
// 2. DATA DUMMY
// ======================================================
const NAMA = [
  'Andi Saputra', 'Budi Sudarsono', 'Citra Pratama', 'Dewi Anggara', 'Eko Purdjianto', 
  'Fajar Ramadhan', 'Gita Wijaya', 'Haryanto', 'Irfan Bachdim', 'Joko Susilo',
  'Kurnia Meiga', 'Lukman Hakim', 'Maulana', 'Nadeo Argawinata', 'Oktovianus', 
  'Pratama Arhan', 'Qori Akbar', 'Rizky Ridho', 'Saddil Ramdani', 'Taufik Hidayat',
  'Umar Syarief', 'Victor Igbonefo', 'Witan Sulaeman', 'Yandi Sofyan', 'Zalnando'
];
const POSISI = ['kiper', 'bek', 'gelandang', 'penyerang'];

// ======================================================
// 3. FUNGSI UTAMA SEEDING
// ======================================================
async function main() {
  // Gunakan URI dari environment atau default ke lokal
  const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tugas_sepakbola';
  await mongoose.connect(DB_URI);
  console.log("✅ Terhubung ke database MongoDB...");

  // Hapus data lama agar tidak menumpuk saat dijalankan berulang
  await Player.deleteMany({});
  await Klub.deleteMany({});
  console.log("🗑️  Data lama berhasil dibersihkan.");

  // Insert data Klub
  const klub = await Klub.insertMany([
    { nama: 'Sriwijaya FC', kota: 'Palembang', stadion: 'Gelora Sriwijaya' },
    { nama: 'Persib Bandung', kota: 'Bandung', stadion: 'Gelora Bandung Lautan Api' },
    { nama: 'Persija Jakarta', kota: 'Jakarta', stadion: 'Jakarta International Stadium' },
  ]);

  // Insert data Player dengan me-mapping array NAMA
  const players = NAMA.map((nama, i) => ({
    nama: nama,
    nomorPunggung: i + 1, // Nomor urut 1-25
    posisi: POSISI[i % 4], // Pembagian posisi secara bergantian (kiper, bek, dll)
    klub_id: klub[i % 3]._id, // Dimasukkan ke 3 klub secara bergantian
    kewarganegaraan: 'Indonesia'
  }));
  await Player.insertMany(players);

  console.log(`🎉 Seed selesai: ${klub.length} klub, ${players.length} player berhasil ditambahkan!`);
  
  // Putuskan koneksi setelah selesai
  await mongoose.disconnect();
}

main().catch((err) => { 
  console.error("❌ Terjadi kesalahan:", err.message); 
  process.exit(1); 
});