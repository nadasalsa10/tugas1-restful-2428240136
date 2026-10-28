// Import Express & Mongoose
const express = require("express");
const mongoose = require("mongoose");


// Membuat aplikasi Express
const app = express();

// Port server
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON dari request body
app.use(express.json());

// ======================================================
// 1. SETUP KONEKSI MONGODB
// ======================================================
// Ganti URI ini dengan URI database Anda
const DB_URI = 'mongodb://127.0.0.1:27017/tugas_sepakbola'; 

mongoose.connect(DB_URI)
  .then(() => console.log('✅ Koneksi ke MongoDB berhasil!'))
  .catch((err) => console.error('❌ Koneksi MongoDB gagal:', err));

// 1. Buat Schema & Model Klub
const klubSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  kota: String,
  stadion: String
});
const Klub = mongoose.model('Klub', klubSchema);

// 2. Modifikasi Player Schema
const playerSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  klub_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Klub',
    required: true
  },
  posisi: { 
    type: String, 
    required: true, 
    enum: ["kiper", "bek", "gelandang", "penyerang"] 
  },
  nomorPunggung: { type: Number, required: true },
  kewarganegaraan: { type: String, default: "Indonesia" }
}, { 
  timestamps: true 
});
const Player = mongoose.model('Player', playerSchema);
// ======================================================

// ======================================================
// MIDDLEWARE API KEY
// ======================================================
const API_KEY = process.env.API_KEY || "player_nada";

function cekApiKey(req, res, next) {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({
      status: "error",
      message: "API key tidak valid",
      data: null
    });
  }
  next();
}

// ======================================================
// GET /
// ======================================================
app.get("/", (req, res) => {
  res.json({
    nama: "Nada Salsabilah",
    nim: "2428240136",
    topik: 24,
    keterangan: "Versi Terhubung dengan MongoDB",
    endpoint: [
      "GET /players",
      "GET /players/:id",
      "POST /players",
      "PUT /players/:id",
      "DELETE /players/:id"
    ]
  });
});

app.post("/klub", async (req, res) => {
  try {
    const klubBaru = await Klub.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Data klub berhasil ditambahkan",
      data: klubBaru
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// ======================================================
// GET /players (DENGAN FILTER, SORT, PROJECTION, PAGINATION)
// ======================================================
app.get("/players", async (req, res) => {
  try {
    // 1. FILTERING (Contoh: ?posisi=gelandang&klub=Garuda FC)
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Tambahkan regex agar pencarian case-insensitive (huruf besar/kecil sama saja)
    if (queryObj.posisi) queryObj.posisi = { $regex: new RegExp(queryObj.posisi, 'i') };
    
    let query = Player.find(queryObj);

    // 2. SORTING (Contoh: ?sort=nomorPunggung atau ?sort=-nama)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort data terbaru
    }

    // 3. PROJECTION / Field Limiting (Contoh: ?fields=nama,klub)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // Hilangkan field __v bawaan mongoose
    }

    // 4. PAGINATION (Contoh: ?page=1&limit=5)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Eksekusi Query
    const players = await query;

    res.status(200).json({
      status: "success",
      total_data: players.length,
      data: players
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ======================================================
// GET /players/:id
// ======================================================
app.get("/players/:id", async (req, res) => {
  try {
    // Gunakan findById bawaan Mongoose
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        status: "error",
        message: `Data dengan id ${req.params.id} tidak ditemukan`,
        data: null
      });
    }

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Format ID tidak valid atau terjadi kesalahan server" });
  }
});

// ======================================================
// POST /players
// ======================================================
app.post("/players", cekApiKey, async (req, res) => {
  try {
    // Karena kita sudah mendefinisikan rules di Mongoose Schema (required, enum, dll),
    // Mongoose akan otomatis memvalidasinya saat .create() dipanggil.
    const playerBaru = await Player.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Data pemain berhasil ditambahkan",
      data: playerBaru
    });
  } catch (error) {
    // Jika validasi mongoose gagal (misal posisi salah / nama kosong)
    res.status(400).json({
      status: "error",
      message: error.message,
      data: null
    });
  }
});

// ======================================================
// PUT /players/:id
// ======================================================
app.put("/players/:id", cekApiKey, async (req, res) => {
  try {
    // runValidators: true memastikan validasi Mongoose (seperti pengecekan posisi) tetap berjalan saat update
    const playerDiubah = await Player.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!playerDiubah) {
      return res.status(404).json({
        status: "error",
        message: `Data dengan id ${req.params.id} tidak ditemukan`,
        data: null
      });
    }

    res.status(200).json({
      status: "success",
      message: `Data pemain dengan id ${req.params.id} berhasil diubah`,
      data: playerDiubah
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message, data: null });
  }
});

// ======================================================
// DELETE /players/:id
// ======================================================
app.delete("/players/:id", cekApiKey, async (req, res) => {
  try {
    const playerDihapus = await Player.findByIdAndDelete(req.params.id);

    if (!playerDihapus) {
      return res.status(404).json({
        status: "error",
        message: `Data dengan id ${req.params.id} tidak ditemukan`,
        data: null
      });
    }

    res.status(200).json({
      status: "success",
      message: `Data pemain dengan id ${req.params.id} berhasil dihapus`,
      data: null
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Format ID tidak valid atau terjadi kesalahan server" });
  }
});

// ======================================================
// Catch-all 404
// ======================================================
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null
  });
});

// Menjalankan server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

// Export app untuk Vercel
module.exports = app;