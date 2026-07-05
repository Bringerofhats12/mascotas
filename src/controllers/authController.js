const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarioModel');

// Mostrar formulario de login
exports.formLogin = (req, res) => {
  // Si ya hay una sesión activa, no tiene sentido volver a mostrar el login
  if (req.session.usuario) return res.redirect('/mascotas');
  res.render('login', { error: null });
};

// Procesar login
exports.login = async (req, res) => {
  const { nombreUsuario, password } = req.body;
  try {
    const usuario = await Usuario.getByUsername(nombreUsuario);

    if (!usuario) {
      return res.render('login', { error: 'Usuario o contraseña incorrectos.' });
    }

    const coincide = await bcrypt.compare(password, usuario.PasswordHash);
    if (!coincide) {
      return res.render('login', { error: 'Usuario o contraseña incorrectos.' });
    }

    // Guardamos en sesión solo lo necesario para mostrar/usar al usuario activo
    req.session.usuario = {
      id: usuario.Id,
      nombreUsuario: usuario.NombreUsuario,
      nombre: usuario.Nombre
    };

    res.redirect('/mascotas');
  } catch (err) {
    res.render('login', { error: 'No se pudo iniciar sesión: ' + err.message });
  }
};

// Mostrar formulario de registro
exports.formRegistro = (req, res) => {
  if (req.session.usuario) return res.redirect('/mascotas');
  res.render('register', { error: null });
};

// Procesar registro
exports.registro = async (req, res) => {
  const { nombreUsuario, nombre, password, confirmarPassword } = req.body;

  try {
    if (!nombreUsuario || !nombre || !password) {
      return res.render('register', { error: 'Todos los campos son obligatorios.' });
    }

    if (password !== confirmarPassword) {
      return res.render('register', { error: 'Las contraseñas no coinciden.' });
    }

    const existente = await Usuario.getByUsername(nombreUsuario);
    if (existente) {
      return res.render('register', { error: 'Ese nombre de usuario ya está en uso.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({ nombreUsuario, nombre, passwordHash });

    // Iniciamos sesión automáticamente tras registrarse
    req.session.usuario = {
      id: nuevoUsuario.Id,
      nombreUsuario: nuevoUsuario.NombreUsuario,
      nombre: nuevoUsuario.Nombre
    };

    res.redirect('/mascotas');
  } catch (err) {
    res.render('register', { error: 'No se pudo completar el registro: ' + err.message });
  }
};

// Cerrar sesión
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
