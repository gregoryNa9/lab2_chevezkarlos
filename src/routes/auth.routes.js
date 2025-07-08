const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const User = require("../models/User");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
    const { username, password, role } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Usuario ya existe" });

    const hashed = await bcrypt.hash(password, 10);
    const secret = speakeasy.generateSecret();

    const user = new User({ username, password: hashed, role, otpSecret: secret.base32 });
    await user.save();

    res.status(201).json({ message: "Registrado correctamente", otpSecret: secret.base32 });
});

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "No existe el usuario" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    res.status(200).json({ message: "Contraseña válida", username });
});

// Verificación OTP
router.post("/verify-otp", async (req, res) => {
    const { username, otp } = req.body;
    const user = await User.findOne({ username });

    const valid = speakeasy.totp.verify({
        secret: user.otpSecret,
        encoding: "base32",
        token: otp,
        window: 1
    });

    if (!valid) return res.status(401).json({ message: "OTP inválido" });

    const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({ token });
});

module.exports = router;
