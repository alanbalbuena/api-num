const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function encryptExistingPasswords() {
  try {
    console.log('🔐 Encriptando contraseñas existentes...');
    
    // Obtener todos los usuarios
    const [usuarios] = await db.query('SELECT id, password FROM usuario');
    
    for (const usuario of usuarios) {
      // Solo encriptar si la contraseña no está encriptada (no empieza con $2b$)
      if (!usuario.password.startsWith('$2b$')) {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);
        
        // Actualizar la contraseña encriptada
        await db.query('UPDATE usuario SET password = ? WHERE id = ?', [hashedPassword, usuario.id]);
        console.log(`✅ Usuario ID ${usuario.id}: Contraseña encriptada`);
      } else {
        console.log(`ℹ️  Usuario ID ${usuario.id}: Contraseña ya encriptada`);
      }
    }
    
    console.log('🎉 Proceso de encriptación completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al encriptar contraseñas:', error);
    process.exit(1);
  }
}

// Ejecutar el script
encryptExistingPasswords(); 