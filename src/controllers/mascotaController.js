const Mascota = require('../models/mascotaModel');

// Listar todas las mascotas
exports.listar = async (req, res) => {
  try {
    const mascotas = await Mascota.getAll();
    res.render('index', { mascotas, error: null });
  } catch (err) {
    res.render('index', {
      mascotas: [],
      error: 'No se pudo conectar a la base de datos. Verifica la configuración en el archivo .env. Detalle: ' + err.message
    });
  }
};

// Mostrar formulario de creación
exports.formCrear = (req, res) => {
  res.render('create', { error: null });
};

// Crear una nueva mascota
exports.crear = async (req, res) => {
  try {
    await Mascota.create(req.body);
    res.redirect('/mascotas');
  } catch (err) {
    res.render('create', { error: 'Error al crear la mascota: ' + err.message });
  }
};

// Mostrar formulario de edición
exports.formEditar = async (req, res) => {
  try {
    const mascota = await Mascota.getById(req.params.id);
    if (!mascota) return res.redirect('/mascotas');
    res.render('edit', { mascota, error: null });
  } catch (err) {
    res.redirect('/mascotas');
  }
};

// Actualizar una mascota existente
exports.editar = async (req, res) => {
  try {
    await Mascota.update(req.params.id, req.body);
    res.redirect('/mascotas');
  } catch (err) {
    let mascota = null;
    try {
      mascota = await Mascota.getById(req.params.id);
    } catch (_) {
      /* si tampoco se puede leer, mascota queda null */
    }
    res.render('edit', {
      mascota: mascota || { Id: req.params.id, ...req.body },
      error: 'Error al actualizar la mascota: ' + err.message
    });
  }
};

// Eliminar una mascota
exports.eliminar = async (req, res) => {
  try {
    await Mascota.remove(req.params.id);
  } catch (err) {
    console.error('Error al eliminar mascota:', err.message);
  }
  res.redirect('/mascotas');
};
