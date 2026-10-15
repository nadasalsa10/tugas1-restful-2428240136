const express = require("express");

const router = express.Router();

const playerController = require("../controller/playersController");
const cekApiKey = require("../../middlewares/cekApiKey");

// GET /players
router.get("/", playerController.getPlayers);

// GET /players/:id
router.get("/:id", playerController.getPlayerById);

// POST /players
router.post("/", cekApiKey, playerController.createPlayer);

// PUT /players/:id
router.put("/:id", cekApiKey, playerController.updatePlayer);

// DELETE /players/:id
router.delete("/:id", cekApiKey, playerController.deletePlayer);

module.exports = router;