const login = document.querySelector("#login");

// Verifica si el usuario ya está registrado
login.addEventListener("click", () => {
  const user = document.querySelector("#username").value.trim();
  if (user !== "") {
    document.cookie = `username=${user}; path=/`; 
    document.location.href = "/";
  } else {
    alert("Por favor ingresa tu nombre de usuario");
  }
});