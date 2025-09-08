const db = require('../config/database');

async function cleanupTokens() {
  try {
    console.log('🧹 Limpiando tokens duplicados y expirados...');
    
    // Limpiar tokens expirados
    const [expiredResult] = await db.query(
      'DELETE FROM refresh_tokens WHERE expires_at < NOW()'
    );
    console.log(`✅ Tokens expirados eliminados: ${expiredResult.affectedRows}`);
    
    // Eliminar tokens duplicados (mantener solo el más reciente por usuario)
    const [duplicateResult] = await db.query(`
      DELETE rt1 FROM refresh_tokens rt1
      INNER JOIN refresh_tokens rt2 
      WHERE rt1.id < rt2.id 
      AND rt1.user_id = rt2.user_id
    `);
    console.log(`✅ Tokens duplicados eliminados: ${duplicateResult.affectedRows}`);
    
    // Mostrar estadísticas
    const [stats] = await db.query('SELECT COUNT(*) as total FROM refresh_tokens');
    console.log(`📊 Total de tokens activos: ${stats[0].total}`);
    
    console.log('🎉 Limpieza completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar tokens:', error);
    process.exit(1);
  }
}

// Ejecutar el script
cleanupTokens(); 