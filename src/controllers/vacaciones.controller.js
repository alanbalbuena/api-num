const Vacaciones = require('../models/vacaciones.model');

// Obtener todo el historial de vacaciones
exports.getAllVacaciones = async (req, res) => {
  try {
    const vacaciones = await Vacaciones.findAll();
    res.json(vacaciones);
  } catch (error) {
    console.error('Error al obtener historial de vacaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el historial de vacaciones'
    });
  }
};

// Obtener historial de vacaciones por ID de usuario
exports.getVacacionesByUsuarioId = async (req, res) => {
  try {
    const vacaciones = await Vacaciones.findByUsuarioId(req.params.id);
    if (!vacaciones || vacaciones.length === 0) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'No se encontró historial de vacaciones para este usuario'
      });
    }
    res.json(vacaciones);
  } catch (error) {
    console.error('Error al obtener historial de vacaciones del usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el historial de vacaciones del usuario'
    });
  }
}; 