const express = require('express');
const { createServer } = require('http');
const realTimeServer = require('./realTimeServer');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const httpServer = createServer(app);

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
// Para servir index.html en la raíz
app.get('/in', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Para servir register.html
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});
app.use(cookieParser());

// Rutas
app.use(require('./routes'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
httpServer.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
})

// Llamo al servidor en tiempo real
realTimeServer(httpServer);