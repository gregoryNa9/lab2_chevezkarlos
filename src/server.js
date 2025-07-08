require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIO = require("socket.io");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");
const { verifyToken } = require("./middleware/auth.middleware");
const { handleSocketAuth } = require("./middleware/socketAuth.middleware");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/auth", authRoutes);
app.use("/chat", verifyToken, chatRoutes);

// Conexión principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Conexión segura a sockets
io.use(handleSocketAuth);

io.on("connection", (socket) => {
    console.log(`Usuario conectado: ${socket.user.username}`);

    socket.on("chat-message", async (data) => {
        io.emit("chat-message", {
            username: socket.user.username,
            message: data.message,
            role: socket.user.role
        });
    });

    socket.on("disconnect", () => {
        console.log(`Usuario desconectado: ${socket.user.username}`);
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Conexión a MongoDB");
        server.listen(process.env.PORT, () =>
            console.log(`Servidor en puerto ${process.env.PORT}`)
        );
    })
    .catch((err) => console.error("Error de conexión:", err));
