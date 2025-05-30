module.exports = (httpServer) => {
    const { Server } = require('socket.io');
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        socket.on("message", (data) => {
            // data debe ser { user, message }
            io.emit("message", {
                user: data.user,
                message: data.message,
            });
        });
    });
};