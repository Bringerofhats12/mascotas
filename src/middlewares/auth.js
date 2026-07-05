/**
 * Middleware de autenticación.
 *
 * requireAuth: bloquea el acceso a rutas si no hay sesión activa
 * y redirige al login.
 *
 * exponerUsuario: pone el usuario de la sesión (si existe) a
 * disposición de TODAS las vistas como "usuarioActivo", sin tener
 * que pasarlo manualmente en cada res.render(...). Así el layout
 * puede mostrarlo en cualquier página del CRUD.
 */

function requireAuth(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

function exponerUsuario(req, res, next) {
  res.locals.usuarioActivo = req.session.usuario || null;
  next();
}

module.exports = { requireAuth, exponerUsuario };
