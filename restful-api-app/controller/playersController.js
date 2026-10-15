const playerModel = require("../models/playerModel");

function getPlayers(req, res) {
  const { posisi } = req.query;

  const players = playerModel.getAllPlayers(posisi);

  res.status(200).json(players);
}

function getPlayerById(req, res, next) {
  const id = parseInt(req.params.id);

  const player = playerModel.getPlayerById(id);

  if (!player) {
    const error = new Error(`Data dengan id ${id} tidak ditemukan`);
    error.status = 404;
    return next(error);
  }

  res.status(200).json(player);
}

function createPlayer(req, res, next) {
  const {
    nama,
    klub,
    posisi,
    nomorPunggung,
    kewarganegaraan
  } = req.body;

  if (!nama || !klub || !posisi || nomorPunggung === undefined) {
    const error = new Error(
      "nama, klub, posisi, dan nomorPunggung wajib diisi"
    );
    error.status = 400;
    return next(error);
  }

  const posisiValid = [
    "kiper",
    "bek",
    "gelandang",
    "penyerang"
  ];

  if (!posisiValid.includes(posisi.toLowerCase())) {
    const error = new Error(
      "posisi harus kiper, bek, gelandang, atau penyerang"
    );
    error.status = 400;
    return next(error);
  }

  if (typeof nomorPunggung !== "number") {
    const error = new Error(
      "nomorPunggung harus berupa angka"
    );
    error.status = 400;
    return next(error);
  }

  const playerBaru = playerModel.addPlayer({
    nama,
    klub,
    posisi,
    nomorPunggung,
    kewarganegaraan
  });

  res.status(201).json({
    status: "success",
    message: "Data pemain berhasil ditambahkan",
    data: playerBaru
  });
}

function updatePlayer(req, res, next) {
  const id = parseInt(req.params.id);

  const {
    nama,
    klub,
    posisi,
    nomorPunggung,
    kewarganegaraan
  } = req.body;

  const playerLama = playerModel.getPlayerById(id);

  if (!playerLama) {
    const error = new Error(
      `Data dengan id ${id} tidak ditemukan`
    );
    error.status = 404;
    return next(error);
  }

  if (!nama || !klub || !posisi || nomorPunggung === undefined) {
    const error = new Error(
      "nama, klub, posisi, dan nomorPunggung wajib diisi"
    );
    error.status = 400;
    return next(error);
  }

  const posisiValid = [
    "kiper",
    "bek",
    "gelandang",
    "penyerang"
  ];

  if (!posisiValid.includes(posisi.toLowerCase())) {
    const error = new Error(
      "posisi harus kiper, bek, gelandang, atau penyerang"
    );
    error.status = 400;
    return next(error);
  }

  if (typeof nomorPunggung !== "number") {
    const error = new Error(
      "nomorPunggung harus berupa angka"
    );
    error.status = 400;
    return next(error);
  }

  const playerDiubah = playerModel.updatePlayer(id, {
    nama,
    klub,
    posisi,
    nomorPunggung,
    kewarganegaraan
  });

  res.status(200).json({
    status: "success",
    message: `Data pemain dengan id ${id} berhasil diubah`,
    data: playerDiubah
  });
}

function deletePlayer(req, res, next) {
  const id = parseInt(req.params.id);

  const player = playerModel.getPlayerById(id);

  if (!player) {
    const error = new Error(
      `Data dengan id ${id} tidak ditemukan`
    );
    error.status = 404;
    return next(error);
  }

  playerModel.deletePlayer(id);

  res.status(200).json({
    status: "success",
    message: `Data pemain dengan id ${id} berhasil dihapus`,
    data: null
  });
}

module.exports = {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};