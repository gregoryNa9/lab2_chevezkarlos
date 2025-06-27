const express = require("express");
const router = express.Router();
const path = require("path");

const views = path.join(__dirname, "/../views");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", isLoggedIn, (req, res) => {
  try {
    res.sendFile(views + "/index.html");
  } catch (error) {
    console.error("Error al servir index.html:", error.message);
    res.status(500).send("Error interno al cargar la página principal.");
  }
});

router.get("/register", (req, res) => {
  try {
    res.sendFile(views + "/register.html");
  } catch (error) {
    console.error("Error al servir register.html:", error.message);
    res.status(500).send("Error interno al cargar la página de registro.");
  }
});

module.exports = router;

