const express = require("express");
const router = express.Router();

router.get("/health", async (req, res, next) => {
  try {
    // Simule une vérification de santé
    const databaseConnected = false; // Simulez une erreur ici
    if (!databaseConnected) {
      throw new Error("La base de données n'est pas connectée.");
    }
    res.status(200).json({ status: "OK", database: "Connected" });
  } catch (err) {
    next(err); // Passe l'erreur au middleware global
  }
});

module.exports = router;
