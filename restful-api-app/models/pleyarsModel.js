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

let nextId = 4;

function getAllPlayers(posisi) {
  if (posisi) {
    return players.filter(
      (player) =>
        player.posisi.toLowerCase() === posisi.toLowerCase()
    );
  }

  return players;
}

function getPlayerById(id) {
  return players.find((player) => player.id === id);
}

function addPlayer(data) {
  const playerBaru = {
    id: nextId++,
    nama: data.nama,
    klub: data.klub,
    posisi: data.posisi.toLowerCase(),
    nomorPunggung: data.nomorPunggung,
    kewarganegaraan: data.kewarganegaraan
  };

  players.push(playerBaru);

  return playerBaru;
}

function updatePlayer(id, data) {
  const index = players.findIndex((player) => player.id === id);

  if (index === -1) {
    return null;
  }

  const playerDiubah = {
    id,
    nama: data.nama,
    klub: data.klub,
    posisi: data.posisi.toLowerCase(),
    nomorPunggung: data.nomorPunggung,
    kewarganegaraan: data.kewarganegaraan
  };

  players[index] = playerDiubah;

  return playerDiubah;
}

function deletePlayer(id) {
  const index = players.findIndex((player) => player.id === id);

  if (index === -1) {
    return false;
  }

  players.splice(index, 1);

  return true;
}

module.exports = {
  getAllPlayers,
  getPlayerById,
  addPlayer,
  updatePlayer,
  deletePlayer
};
