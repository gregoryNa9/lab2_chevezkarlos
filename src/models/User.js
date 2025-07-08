const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "moderador", "usuario"], default: "usuario" },
    otpSecret: { type: String }
});

module.exports = mongoose.model("User", userSchema);
