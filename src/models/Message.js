const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    role: String
});

module.exports = mongoose.model("Message", messageSchema);
