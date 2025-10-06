const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(err));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
