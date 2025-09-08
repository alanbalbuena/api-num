const db = require('../config/database');

class Usuario {
  // Obtener todos los usuarios
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM usuario ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un usuario por ID
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener un usuario por correo (para login)
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM usuario WHERE correo = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo usuario
  static async create(usuarioData) {
    const { nombre, apellido, correo, permisos, password } = usuarioData;
    try {
      const [result] = await db.query(
        'INSERT INTO usuario (nombre, apellido, correo, permisos, password) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, correo, permisos, password]
      );
      return { id: result.insertId, ...usuarioData };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un usuario
  static async update(id, usuarioData) {
    const { nombre, apellido, correo, permisos, password } = usuarioData;
    try {
      let query, params;
      
      if (password) {
        query = 'UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, permisos = ?, password = ? WHERE id = ?';
        params = [nombre, apellido, correo, permisos, password, id];
      } else {
        query = 'UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, permisos = ? WHERE id = ?';
        params = [nombre, apellido, correo, permisos, id];
      }
      
      const [result] = await db.query(query, params);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un usuario
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM usuario WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Usuario; 