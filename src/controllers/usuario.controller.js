const Usuario = require('../models/usuario.model');

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    
    // Remover contraseñas de la respuesta
    const usuariosSinPassword = usuarios.map(usuario => {
      const { password, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword;
    });
    
    res.json(usuariosSinPassword);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los usuarios'
    });
  }
};

// Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Usuario no encontrado'
      });
    }
    
    // Remover contraseña de la respuesta
    const { password, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el usuario'
    });
  }
};

const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, permisos, password } = req.body;

    // Validación básica
    if (!nombre || !apellido || !correo || !permisos || !password) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findByEmail(correo);
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Correo duplicado',
        message: 'Ya existe un usuario con ese correo'
      });
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      permisos,
      password: hashedPassword
    });

    // Enviar respuesta sin contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear el usuario'
    });
  }
};

// Actualizar un usuario
exports.updateUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, permisos } = req.body;
    const id = req.params.id;

    // Validación básica
    if (!nombre || !apellido || !correo || !permisos) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Todos los campos son requeridos'
      });
    }

    const actualizado = await Usuario.update(id, {
      nombre,
      apellido,
      correo,
      permisos
    });

    if (!actualizado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      id,
      nombre,
      apellido,
      correo,
      permisos
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el usuario'
    });
  }
};

// Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const eliminado = await Usuario.delete(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el usuario'
    });
  }
}; 