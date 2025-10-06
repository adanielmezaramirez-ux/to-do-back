const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true }
});

// Encriptar contraseña antes de guardar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
  next();
});

// Comparar contraseñas
UserSchema.methods.compararContraseña = function (entrada) {
  return bcrypt.compare(entrada, this.contraseña);
};

module.exports = mongoose.model('User', UserSchema);
