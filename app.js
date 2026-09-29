// Import Express
const express = require("express");

// Membuat aplikasi Express
const app = express();

// Port server
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON dari request body
app.use(express.json());

// Data awal pemain
let players = [
  {
    id: 1,
    nama: "Fajar Ramadhan",
    klub: "Garuda FC",
    posisi: "gelandang",
    nomorPunggung: 8,
    kewarganegaraan: "Indonesia"
  },
  {
    id: 2,
    nama: "Rizky Pratama",
    klub: "Sriwijaya United",
    posisi: "penyerang",
    nomorPunggung: 9,
    kewarganegaraan: "Indonesia"
  },
  {
    id: 3,
    nama: "Andi Saputra",
    klub: "Palembang FC",
    posisi: "bek",
    nomorPunggung: 4,
    kewarganegaraan: "Indonesia"
  }
];

// ID berikutnya
let nextId = 4;

// GET /
// Menampilkan informasi API
app.get("/", (req, res) => {
  res.json({
    nama: "Nada Salsabilah",
    nim: "2428240136",
    topik: 24,
    endpoint: [
      "GET /players",
      "GET /players/:id",
      "POST /players",
      "PUT /players/:id",
      "DELETE /players/:id",
      "GET /players?posisi=gelandang"
    ]
  });
});


// ======================================================
// GET /players
// Mengambil semua data pemain
// ======================================================
app.get("/players", (req, res) => {
  const { posisi } = req.query;

  // Jika ada filter posisi
  if (posisi) {
    const hasilFilter = players.filter(
      (player) => player.posisi.toLowerCase() === posisi.toLowerCase()
    );

    return res.status(200).json(hasilFilter);
  }

  // Jika tidak ada filter
  res.status(200).json(players);
});


// ======================================================
// GET /players/:id
// Mengambil satu data pemain berdasarkan id
// ======================================================
app.get("/players/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const player = players.find((player) => player.id === id);

  if (!player) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  res.status(200).json(player);
});


// ======================================================
// POST /players
// Body:
// {
//   "nama": "Fajar Ramadhan",
//   "klub": "Garuda FC",
//   "posisi": "gelandang",
//   "nomorPunggung": 8,
//   "kewarganegaraan": "Indonesia"
// }
// ======================================================
app.post("/players", (req, res) => {
  const {
    nama,
    klub,
    posisi,
    nomorPunggung,
    kewarganegaraan
  } = req.body;

  // Validasi field wajib
  if (!nama || !klub || !posisi || nomorPunggung === undefined) {
    return res.status(400).json({
      status: "error",
      message: "nama, klub, posisi, dan nomorPunggung wajib diisi",
      data: null
    });
  }

  // Validasi posisi
  const posisiValid = ["kiper", "bek", "gelandang", "penyerang"];

  if (!posisiValid.includes(posisi.toLowerCase())) {
    return res.status(400).json({
      status: "error",
      message: "posisi harus kiper, bek, gelandang, atau penyerang",
      data: null
    });
  }

  // Validasi nomor punggung
  if (typeof nomorPunggung !== "number") {
    return res.status(400).json({
      status: "error",
      message: "nomorPunggung harus berupa angka",
      data: null
    });
  }

  // Membuat data pemain baru
  const playerBaru = {
    id: nextId++,
    nama,
    klub,
    posisi: posisi.toLowerCase(),
    nomorPunggung,
    kewarganegaraan
  };

  players.push(playerBaru);

  res.status(201).json({
    status: "success",
    message: "Data pemain berhasil ditambahkan",
    data: playerBaru
  });
});


// ======================================================
// PUT /players/:id
// Mengubah seluruh data pemain
// ======================================================
// Body:
// {
//   "nama": "Fajar Ramadhan",
//   "klub": "Garuda FC",
//   "posisi": "gelandang",
//   "nomorPunggung": 10,
//   "kewarganegaraan": "Indonesia"
// }
// ======================================================
app.put("/players/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = players.findIndex((player) => player.id === id);

  // Jika data tidak ditemukan
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  const {
    nama,
    klub,
    posisi,
    nomorPunggung,
    kewarganegaraan
  } = req.body;

  // Validasi field wajib
  if (!nama || !klub || !posisi || nomorPunggung === undefined) {
    return res.status(400).json({
      status: "error",
      message: "nama, klub, posisi, dan nomorPunggung wajib diisi",
      data: null
    });
  }

  // Validasi posisi
  const posisiValid = ["kiper", "bek", "gelandang", "penyerang"];

  if (!posisiValid.includes(posisi.toLowerCase())) {
    return res.status(400).json({
      status: "error",
      message: "posisi harus kiper, bek, gelandang, atau penyerang",
      data: null
    });
  }

  // Validasi nomor punggung
  if (typeof nomorPunggung !== "number") {
    return res.status(400).json({
      status: "error",
      message: "nomorPunggung harus berupa angka",
      data: null
    });
  }

  // Mengganti seluruh data pemain
  const playerDiubah = {
    id,
    nama,
    klub,
    posisi: posisi.toLowerCase(),
    nomorPunggung,
    kewarganegaraan
  };

  players[index] = playerDiubah;

  res.status(200).json({
    status: "success",
    message: `Data pemain dengan id ${id} berhasil diubah`,
    data: playerDiubah
  });
});


// ======================================================
// DELETE /players/:id
// Menghapus data pemain
// ======================================================
app.delete("/players/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = players.findIndex((player) => player.id === id);

  // Jika data tidak ditemukan
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null
    });
  }

  players.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: `Data pemain dengan id ${id} berhasil dihapus`,
    data: null
  });
});


// ======================================================
// Catch-all 404
// Menangani endpoint yang tidak terdaftar
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
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}


// Export app untuk Vercel
module.exports = app;