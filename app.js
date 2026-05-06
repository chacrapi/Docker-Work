const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Configuración de la conexión a MongoDB según credenciales de docker-compose
const mongoUri = 'mongodb://root:DoD_CRM_DATABASE_25@mongodb:27017/crm?authSource=admin';

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB correctamente'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Bienvenido al sistema IT-CRM - DAWn of Development');
});

app.listen(port, () => {
  console.log(`Servidor Node.js (IT-CRM) escuchando en el puerto ${port}`);
});
