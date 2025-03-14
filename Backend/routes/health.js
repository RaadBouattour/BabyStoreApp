const express = require("express");
const router = express.Router();

router.get("/health", async (req, res, next) => {
  try {
    
    const databaseConnected = false; 
    if (!databaseConnected) {
      throw new Error("La base de données n'est pas connectée.");
    }
    res.status(200).json({ status: "OK", database: "Connected" });
  } catch (err) {
    next(err); 
  }
});

module.exports = router;
