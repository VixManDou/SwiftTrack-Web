// Middleware simple para proteger las rutas administrativas con acceso autenticado
module.exports = function securityMiddleware(req, res, next) {
  const rol = (req.query.rol || req.body.rol || 'user').toString();
  const auth = (req.query.auth || req.body.auth || '').toString();

  if (rol === 'admin' && auth === 'true') {
    return next();
  }

  return res.status(403).render('403', { mensaje: 'Acceso denegado: se requiere autenticación de administrador.' });
};
