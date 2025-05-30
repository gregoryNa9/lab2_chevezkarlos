const socket = io();

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const username = getCookie("username");
if (!username) {
  window.location.href = "register.html";
}

const send = document.querySelector("#send-message");
const allMessages = document.querySelector("#all-messages");

send.addEventListener("click", () => {
  const message = document.querySelector("#message").value;
  if (message.trim()) {
    socket.emit("message", { user: username, message });
    document.querySelector("#message").value = "";
  }
});

socket.on("message", ({ user, message }) => {
  const msg = document.createRange().createContextualFragment(`
    <style>
    .text-muted-white {
      color: white !important;
    }
    </style>
    <div class="message d-flex align-items-start">
      <img src="/img/Foto.jpg" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;">
      <div>
        <div class="user-info d-flex align-items-center mb-1">
          <span class="fw-bold me-2">${user}</span>
          <span class="text-muted-white small">Hace 1 minuto</span>
        </div>
        <p class="mb-0">${message}</p>
      </div>
    </div>
  `);
  allMessages.append(msg);
});
