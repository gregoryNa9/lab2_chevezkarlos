const express = require('express');
const { createServer } = require('http');
const realTimeServer = require('./realTimeServer');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const httpServer = createServer(app);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

// Para servir index.html en la raíz
app.get('/in', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  } catch (err) {
    console.error("Error al servir /in:", err.message);
    res.status(500).send("Error interno al cargar la página.");
  }
});

// Para servir register.html
app.get('/register.html', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
  } catch (err) {
    console.error("Error al servir /register.html:", err.message);
    res.status(500).send("Error interno al cargar el registro.");
  }
});

app.use(cookieParser());

// Rutas
app.use(require('./routes'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de ruta no encontrada
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de errores generales
app.use((err, req, res, next) => {
  console.error("Error general:", err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
httpServer.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});

// Servidor en tiempo real
realTimeServer(httpServer);
