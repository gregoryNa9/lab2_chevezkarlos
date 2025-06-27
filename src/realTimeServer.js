module.exports = (httpServer) => {
    const { Server } = require('socket.io');
    const io = new Server(httpServer);

    const users = {};

    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado:", socket.id);

        socket.on("new-user", (username) => {
            try {
                if (!username || typeof username !== 'string' || username.trim() === "") {
                    socket.emit("error", { message: "Nombre de usuario inválido." });
                    return;
                }

                socket.username = username.trim();

                if (!users[socket.username]) {
                    users[socket.username] = { connected: true, sockets: new Set() };
                }

                users[socket.username].connected = true;
                users[socket.username].sockets.add(socket.id);

                io.emit("user-list", Object.entries(users).map(([user, info]) => ({
                    user,
                    connected: info.connected
                })));

                console.log("Usuario conectado:", socket.username);
            } catch (err) {
                console.error("Error en new-user:", err.message);
                socket.emit("error", { message: "Error al registrar usuario." });
            }
        });

        socket.on("message", (data) => {
            try {
                if (!data || typeof data.message !== 'string' || data.message.trim() === "") {
                    socket.emit("error", { message: "Mensaje inválido." });
                    return;
                }

                io.emit("message", {
                    user: data.user || "Anónimo",
                    message: data.message.trim(),
                });
            } catch (err) {
                console.error("Error al procesar mensaje:", err.message);
                socket.emit("error", { message: "Error al enviar mensaje." });
            }
        });

        socket.on("disconnect", () => {
            try {
                const username = socket.username;
                if (username && users[username]) {
                    users[username].sockets.delete(socket.id);
                    if (users[username].sockets.size === 0) {
                        users[username].connected = false;
                    }

                    io.emit("user-list", Object.entries(users).map(([user, info]) => ({
                        user,
                        connected: info.connected
                    })));

                    console.log("Usuario desconectado:", username);
                }
            } catch (err) {
                console.error("Error al manejar desconexión:", err.message);
            }
        });
    });
};
