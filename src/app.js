const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const mascotaRoutes = require('./routes/mascotaRoutes');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, exponerUsuario } = require('./middlewares/auth');

const app = express();

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // permite usar PUT/DELETE desde formularios HTML
app.use(express.static(path.join(__dirname, '..', 'public')));

// Sesiones (mantienen al usuario activo mientras navega por el CRUD)
app.use(session({
  secret: process.env.SESSION_SECRET || 'patitas-con-amor-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2 // 2 horas
  }
}));

// Pone req.session.usuario a disposición de todas las vistas como "usuarioActivo"
app.use(exponerUsuario);

// Rutas
app.get('/', (req, res) => res.redirect('/mascotas'));
app.use('/', authRoutes);                         // /login, /registro, /logout (públicas)
app.use('/mascotas', requireAuth, mascotaRoutes);  // protegidas: requieren sesión activa

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

module.exports = app;
