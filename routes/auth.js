const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Registro
router.post('/register', async (req, res) => {
  const { nombre, usuario, email, contraseña } = req.body;

  try {
    const existingUser = await User.findOne({ usuario });
    if (existingUser) return res.status(400).json({ error: 'El usuario ya existe' });

    const newUser = new User({ nombre, usuario, email, contraseña });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const esValida = await user.compararContraseña(contraseña);
    if (!esValida) return res.status(401).json({ error: 'Contraseña incorrecta' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
    });

    res.status(200).json({
    message: 'Login exitoso',
    user: { id: user._id, nombre: user.nombre },
    token
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error en el login' });
  }
});

module.exports = router;
