const db = require('../config/database');

class Cliente {
  // Función para generar el código del cliente (para nuevos clientes)
  static async generateCodigo(sede) {
    try {
      // Determinar el número de sede
      const sedeNumero = sede.toUpperCase() === 'GUADALAJARA' ? '1' : '2';
      
      // Obtener el último registro de la sede específica
      const [rows] = await db.query(
        'SELECT codigo FROM cliente ORDER BY id DESC LIMIT 1',
        [`NM${sedeNumero}%`]
      );
      
      let nextCodigo = 1;
      if (rows.length > 0) {
        // Extraer los últimos 4 dígitos del último código
        const ultimoCodigo = rows[0].codigo;
        const ultimoNumero = parseInt(ultimoCodigo.substring(3));
        nextCodigo = ultimoNumero + 1;
      }
      
      // Generar el código con el formato NM + sede + código secuencial (4 dígitos con ceros a la izquierda)
      const codigo = `NM${sedeNumero}${nextCodigo.toString().padStart(4, '0')}`;
      
      return codigo;
    } catch (error) {
      throw error;
    }
  }


  // Obtener todos los clientes (con búsqueda por query param)
  static async findAll(search) {
    try {
      let query = 'SELECT * FROM cliente';
      let params = [];
      if (search) {
        query += ' WHERE nombre LIKE ?';
        params.push(`${search.toUpperCase()}%`);
      }
      query += ' ORDER BY id DESC';
      const [rows] = await db.query(query, params);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un cliente por ID con sus razones sociales y esquemas
  static async findById(id) {
    try {
      // Obtener el cliente
      const [clienteRows] = await db.query('SELECT * FROM cliente WHERE id = ?', [id]);
      if (clienteRows.length === 0) {
        return null;
      }

      const cliente = clienteRows[0];

      // Obtener las razones sociales del cliente
      const [razonSocialRows] = await db.query(`
        SELECT * FROM razon_social 
        WHERE id_cliente = ? 
        ORDER BY id DESC
      `, [id]);

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

      return {
        ...cliente,
        razones_sociales: razonesSocialesConEsquemas
      };
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo cliente
  static async create(clienteData) {
    const { 
      nombre, 
      sede, 
      origen
    } = clienteData;
    
    try {
      // Generar el código automáticamente
      const codigo = await Cliente.generateCodigo(sede);

      const [result] = await db.query(
        `INSERT INTO cliente (
          codigo,
          nombre, 
          sede, 
          origen
        ) VALUES (?, ?, ?, ?)`,
        [
          codigo,
          nombre, 
          sede, 
          origen
        ]
      );
      
      return { id: result.insertId, codigo, nombre, sede, origen };
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un cliente
  static async update(id, clienteData) {
    const { 
      nombre, 
      sede, 
      origen
    } = clienteData;
    
    try {
      // Obtener el cliente actual para verificar si cambió la sede
      const [currentClient] = await db.query('SELECT sede FROM cliente WHERE id = ?', [id]);
      
      let codigo = null;
      // Solo regenerar el código si cambió la sede
      if (currentClient[0] && currentClient[0].sede !== sede.toUpperCase()) {
        codigo = await Cliente.generateCodigo(sede);
      }

      const updateFields = [
        nombre, 
        sede, 
        origen
      ];

      let query = `UPDATE cliente SET 
        nombre = ?, 
        sede = ?, 
        origen = ?`;

      // Si se generó un nuevo código, incluirlo en la actualización
      if (codigo) {
        query += ', codigo = ?';
        updateFields.push(codigo);
      }

      query += ' WHERE id = ?';
      updateFields.push(id);

      const [result] = await db.query(query, updateFields);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un cliente
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM cliente WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Buscar clientes que empiecen con una letra específica
  static async findByLetter(letter) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM cliente WHERE nombre LIKE ? ORDER BY id DESC',
        [`${letter.toUpperCase()}%`]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Buscar un cliente por su código
  static async findByCodigo(codigo) {
    try {
      const [rows] = await db.query('SELECT * FROM cliente WHERE codigo = ?', [codigo]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }






}

module.exports = Cliente; 