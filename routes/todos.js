const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// Obtener todos los todos del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ orden: 1 }); // ordenados
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los todos' });
  }
});

// Crear un nuevo todo
router.post('/', auth, async (req, res) => {
  try {
    // Buscar la tarea con mayor 'orden' para este usuario
    const maxOrdenTodo = await Todo.findOne({ userId: req.user.id }).sort({ orden: -1 }).exec();

    // Si hay tareas, nuevo orden = max + 1, sino 1
    const nuevoOrden = maxOrdenTodo ? maxOrdenTodo.orden + 1 : 1;

    const newTodo = new Todo({
      title: req.body.title,
      userId: req.user.id,
      orden: nuevoOrden,
    });

    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    console.error('Error al crear el todo:', error);
    res.status(500).json({ error: 'Error al crear el todo' });
  }
});


// Marcar como completado
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { completed: req.body.completed },
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ error: 'Todo no encontrado' });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el todo' });
  }
});

// Editar el título
router.patch('/:id', auth, async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Título inválido' });
  }

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title },
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ error: 'Todo no encontrado' });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Error al editar el todo' });
  }
});

// Eliminar todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedTodo) return res.status(404).json({ error: 'Todo no encontrado' });
    res.json({ message: 'Todo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el todo' });
  }
});

module.exports = router;
