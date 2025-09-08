const db = require('../config/database');

class Banco {
  // Obtener todos los bancos (con búsqueda opcional)
  static async findAll(search = null) {
    try {
      let query = 'SELECT * FROM view_bancos_empresas';
      let params = [];
      
      if (search) {
        query += ' WHERE nombre_banco LIKE ? OR numero_cuenta LIKE ? OR clabe_interbancaria LIKE ? OR empresa_nombre LIKE ?';
        const searchTerm = `%${search}%`;
        params = [searchTerm, searchTerm, searchTerm, searchTerm];
      }
      
      query += ' ORDER BY id DESC';
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener bancos por empresa
  static async findByEmpresa(empresaId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_bancos_empresas WHERE id_empresa = ? ORDER BY id DESC',
        [empresaId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un banco por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_bancos_empresas WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener banco por CLABE
  static async findByClabe(clabe) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_bancos_empresas WHERE clabe_interbancaria = ?',
        [clabe]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener banco por número de cuenta
  static async findByNumeroCuenta(numeroCuenta) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_bancos_empresas WHERE numero_cuenta = ?',
        [numeroCuenta]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo banco
  static async create(bancoData) {
    const { 
      nombre_banco, 
      numero_cuenta, 
      clabe_interbancaria, 
      saldo_inicial, 
      id_empresa 
    } = bancoData;
    
    try {
      const [result] = await db.query(
        `INSERT INTO bancos (
          nombre_banco, 
          numero_cuenta, 
          clabe_interbancaria, 
          saldo_inicial, 
          id_empresa
        ) VALUES (?, ?, ?, ?, ?)`,
        [nombre_banco, numero_cuenta, clabe_interbancaria, saldo_inicial || 0, id_empresa]
      );
      
      return { id: result.insertId, ...bancoData };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un banco
  static async update(id, bancoData) {
    const { 
      nombre_banco, 
      numero_cuenta, 
      clabe_interbancaria, 
      saldo_inicial, 
      id_empresa 
    } = bancoData;
    
    try {
      const [result] = await db.query(
        `UPDATE bancos SET 
          nombre_banco = ?, 
          numero_cuenta = ?, 
          clabe_interbancaria = ?, 
          saldo_inicial = ?, 
          id_empresa = ?
        WHERE id = ?`,
        [nombre_banco, numero_cuenta, clabe_interbancaria, saldo_inicial, id_empresa, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un banco
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM bancos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Buscar bancos por nombre del banco
  static async findByNombreBanco(nombreBanco) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM view_bancos_empresas WHERE nombre_banco LIKE ? ORDER BY id DESC',
        [`%${nombreBanco}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas de bancos
  static async getStats() {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as total_bancos,
          COUNT(DISTINCT id_empresa) as total_empresas,
          SUM(saldo_inicial) as saldo_total
        FROM bancos
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Verificar si existe un banco con la misma CLABE
  static async existsByClabe(clabe, excludeId = null) {
    try {
      if (!clabe) return false; // Si no hay CLABE, no hay duplicado
      
      let query = 'SELECT COUNT(*) as count FROM bancos WHERE clabe_interbancaria = ?';
      let params = [clabe];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      const [rows] = await db.query(query, params);
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // Verificar si existe un banco con el mismo número de cuenta
  static async existsByNumeroCuenta(numeroCuenta, excludeId = null) {
    try {
      if (!numeroCuenta) return false; // Si no hay número de cuenta, no hay duplicado
      
      let query = 'SELECT COUNT(*) as count FROM bancos WHERE numero_cuenta = ?';
      let params = [numeroCuenta];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      const [rows] = await db.query(query, params);
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Banco; 