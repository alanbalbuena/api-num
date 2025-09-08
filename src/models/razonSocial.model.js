const db = require('../config/database');

class RazonSocial {
  // Crear una nueva razón social
  static async create(razonSocialData) {
    const { 
      id_cliente, 
      razon_social, 
      rfc, 
      regimen_fiscal, 
      calle, 
      numero_interior, 
      numero_exterior, 
      colonia, 
      codigo_postal, 
      ciudad, 
      estado,
      forma_pago,
      metodo_pago,
      uso_cfdi
    } = razonSocialData;
    
    try {
      const [result] = await db.query(
        `INSERT INTO razon_social (
          id_cliente, 
          razon_social, 
          rfc, 
          regimen_fiscal, 
          calle, 
          numero_interior, 
          numero_exterior, 
          colonia, 
          codigo_postal, 
          ciudad, 
          estado,
          forma_pago,
          metodo_pago,
          uso_cfdi
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_cliente, 
          razon_social, 
          rfc, 
          regimen_fiscal, 
          calle, 
          numero_interior, 
          numero_exterior, 
          colonia, 
          codigo_postal, 
          ciudad, 
          estado,
          forma_pago,
          metodo_pago,
          uso_cfdi
        ]
      );
      return { id: result.insertId, ...razonSocialData };
    } catch (error) {
      throw error;
    }
  }

  // Obtener todas las razones sociales
  static async findAll() {
    try {
      const [rows] = await db.query(`
        SELECT rs.*, c.nombre as nombre_cliente, c.codigo as codigo_cliente 
        FROM razon_social rs 
        JOIN cliente c ON rs.id_cliente = c.id 
        ORDER BY rs.id DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener razón social por ID
  static async findById(id) {
    try {
      const [rows] = await db.query(`
        SELECT rs.*, c.nombre as nombre_cliente, c.codigo as codigo_cliente 
        FROM razon_social rs 
        JOIN cliente c ON rs.id_cliente = c.id 
        WHERE rs.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener razones sociales por cliente
  static async findByClienteId(clienteId) {
    try {
      const [rows] = await db.query(`
        SELECT rs.*, c.nombre as nombre_cliente, c.codigo as codigo_cliente 
        FROM razon_social rs 
        JOIN cliente c ON rs.id_cliente = c.id 
        WHERE rs.id_cliente = ? 
        ORDER BY rs.id DESC
      `, [clienteId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar por RFC
  static async findByRfc(rfc) {
    try {
      const [rows] = await db.query(`
        SELECT rs.*, c.nombre as nombre_cliente, c.codigo as codigo_cliente 
        FROM razon_social rs 
        JOIN cliente c ON rs.id_cliente = c.id 
        WHERE rs.rfc = ?
      `, [rfc]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar una razón social
  static async update(id, razonSocialData) {
    const { 
      id_cliente, 
      razon_social, 
      rfc, 
      regimen_fiscal, 
      calle, 
      numero_interior, 
      numero_exterior, 
      colonia, 
      codigo_postal, 
      ciudad, 
      estado,
      forma_pago,
      metodo_pago,
      uso_cfdi
    } = razonSocialData;
    
    try {
      const [result] = await db.query(
        `UPDATE razon_social SET 
          id_cliente = ?, 
          razon_social = ?, 
          rfc = ?, 
          regimen_fiscal = ?, 
          calle = ?, 
          numero_interior = ?, 
          numero_exterior = ?, 
          colonia = ?, 
          codigo_postal = ?, 
          ciudad = ?, 
          estado = ?,
          forma_pago = ?,
          metodo_pago = ?,
          uso_cfdi = ?
          WHERE id = ?`,
        [
          id_cliente, 
          razon_social, 
          rfc, 
          regimen_fiscal, 
          calle, 
          numero_interior, 
          numero_exterior, 
          colonia, 
          codigo_postal, 
          ciudad, 
          estado,
          forma_pago,
          metodo_pago,
          uso_cfdi,
          id
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar razones sociales por cliente
  static async deleteByCliente(id_cliente) {
    try {
      const [result] = await db.query('DELETE FROM razon_social WHERE id_cliente = ?', [id_cliente]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una razón social por ID
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM razon_social WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Obtener una razón social con sus esquemas
  static async findByIdWithEsquemas(id) {
    try {
      // Obtener la razón social
      const [razonSocialRows] = await db.query(`
        SELECT rs.*, c.nombre as nombre_cliente, c.codigo as codigo_cliente 
        FROM razon_social rs 
        JOIN cliente c ON rs.id_cliente = c.id 
        WHERE rs.id = ?
      `, [id]);
      
      if (razonSocialRows.length === 0) {
        return null;
      }

      const razonSocial = razonSocialRows[0];

      // Obtener los esquemas asociados
      const [esquemaRows] = await db.query(`
        SELECT * FROM esquema 
        WHERE id_razon_social = ? 
        ORDER BY id DESC
      `, [id]);

      return {
        ...razonSocial,
        esquemas: esquemaRows
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtener todas las razones sociales con sus esquemas
  static async findAllWithEsquemas() {
    try {
      // Obtener todas las razones sociales
      const [razonSocialRows] = await db.query(`
        SELECT rs.*, c.nombre as nombre_cliente, c.codigo as codigo_cliente 
        FROM razon_social rs 
        JOIN cliente c ON rs.id_cliente = c.id 
        ORDER BY rs.id DESC
      `);

      // Para cada razón social, obtener sus esquemas
      const razonesSocialesConEsquemas = await Promise.all(
        razonSocialRows.map(async (razonSocial) => {
          const [esquemaRows] = await db.query(`
            SELECT * FROM esquema 
            WHERE id_razon_social = ? 
            ORDER BY id DESC
          `, [razonSocial.id]);

          return {
            ...razonSocial,
            esquemas: esquemaRows
          };
        })
      );

      return razonesSocialesConEsquemas;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RazonSocial;
