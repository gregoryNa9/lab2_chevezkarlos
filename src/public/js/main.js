let token = "";
let socket;

function register() {
    const username = document.getElementById("reg-user").value;
    const password = document.getElementById("reg-pass").value;
    const role = document.getElementById("reg-role").value;

    fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
    })
        .then(res => res.json())
        .then(data => alert(`Registrado: Guarda esta clave OTP: ${data.otpSecret}`));
}

function login() {
    const username = document.getElementById("login-user").value;
    const password = document.getElementById("login-pass").value;

    fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            alert("Contraseña válida, introduce el OTP");
            localStorage.setItem("username", username);
        });
}

function verifyOTP() {
    const username = localStorage.getItem("username");
    const otp = document.getElementById("otp").value;

    fetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp })
    })
        .then(res => res.json())
        .then(data => {
            token = data.token;
            alert("Autenticado con éxito");
            connectSocket();
        });
}

function connectSocket() {
    socket = io({
        auth: { token }
    });

    socket.on("connect", () => {
        console.log("Conectado al socket");
    });

    socket.on("chat-message", (data) => {
        const div = document.createElement("div");
        div.textContent = `[${data.role}] ${data.username}: ${data.message}`;
        document.getElementById("chat").appendChild(div);
    });
}

function sendMessage() {
    const msg = document.getElementById("message").value;
    socket.emit("chat-message", { message: msg });
    document.getElementById("message").value = "";
}
