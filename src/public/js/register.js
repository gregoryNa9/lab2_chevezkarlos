const login = document.querySelector("#login");

login.addEventListener("click", () => {
  const userInput = document.querySelector("#username");
  const user = userInput.value.trim();

  if (!user || user.length < 3) {
    alert("Por favor ingresa un nombre válido (mínimo 3 caracteres).");
    userInput.focus();
    return;
  }

  try {
    document.cookie = `username=${user}; path=/`; 
    window.location.href = "/";
  } catch (err) {
    console.error("Error al guardar nombre de usuario:", err.message);
    alert("No se pudo guardar el nombre de usuario. Intenta de nuevo.");
  }
});
