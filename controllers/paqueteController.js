const paquetesFicticios = require('../public/js/paquetesFicticios');
const supabase = require('../config/supabase');

const HISTORIAL_TABLE = 'paquete_historial';

const PAQUETERIAS_CATALOG = [
  'Paquetería Aguascalientes',
  'Paquetería Baja California',
  'Paquetería Baja California Sur',
  'Paquetería Campeche',
  'Paquetería Chiapas',
  'Paquetería Chihuahua',
  'Paquetería Ciudad de México',
  'Paquetería Coahuila',
  'Paquetería Colima',
  'Paquetería Durango',
  'Paquetería Estado de México',
  'Paquetería Guanajuato',
  'Paquetería Guerrero',
  'Paquetería Hidalgo',
  'Paquetería Jalisco',
  'Paquetería Michoacán',
  'Paquetería Morelos',
  'Paquetería Nayarit',
  'Paquetería Nuevo León',
  'Paquetería Oaxaca',
  'Paquetería Puebla',
  'Paquetería Querétaro',
  'Paquetería Quintana Roo',
  'Paquetería San Luis Potosí',
  'Paquetería Sinaloa',
  'Paquetería Sonora',
  'Paquetería Tabasco',
  'Paquetería Tamaulipas',
  'Paquetería Tlaxcala',
  'Paquetería Veracruz',
  'Paquetería Yucatán',
  'Paquetería Zacatecas',
];

function getFechaHoraStrings() {
  const now = new Date();
  return {
    fecha: now.toISOString().slice(0, 10),
    hora: now.toTimeString().slice(0, 8),
  };
}

function esPaqueteriaValida(valor) {
  return PAQUETERIAS_CATALOG.includes(valor);
}

function renderIndex(res, options = {}) {
  return res.render('index', {
    mostrarGestion: false,
    paquetes: [],
    paqueteEncontrado: null,
    mensaje: null,
    mostrarLogin: false,
    loginMensaje: null,
    ...options,
  });
}

function obtenerHome(req, res) {
  const rol = (req.query.rol || 'user').toString();
  const autenticado = req.query.auth === 'true' || req.query.auth === '1';
  const mostrarGestion = rol === 'admin' && autenticado;

  if (mostrarGestion) {
    return renderIndex(res, {
      mostrarGestion: true,
      paquetes: paquetesFicticios.getPaquetes(),
      paqueteEncontrado: null,
      mensaje: null,
      mostrarLogin: false,
      loginMensaje: null,
    });
  }

  return renderIndex(res, {
    mostrarGestion: false,
    paquetes: [],
    paqueteEncontrado: null,
    mensaje: null,
    mostrarLogin: false,
    loginMensaje: null,
  });
}

async function apiObtenerPaquetePorFolio(req, res) {
  const folioRaw = req.params.folio || '';
  const folio = folioRaw.toString().trim();

  if (!folio) {
    return res.status(400).json({ error: 'Folio es requerido' });
  }

  const { data, error } = await supabase
    .from('paquetes')
    .select('id, folio, destino, estado, peso')
    .eq('folio', folio)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Error al consultar la base de datos' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Paquete no encontrado' });
  }

  return res.json(data);
}

function mostrarLoginAdmin(req, res) {
  return res.render('admin-login', {
    loginMensaje: null,
  });
}

function loginAdmin(req, res) {
  const usuario = (req.body.usuario || '').toString().trim();
  const password = (req.body.password || '').toString().trim();

  if (usuario === 'Admin' && password === '1234abcd') {
    return res.redirect('/admin/dashboard?rol=admin&auth=true');
  }

  return res.status(401).render('admin-login', {
    loginMensaje: 'Credenciales incorrectas. Intenta nuevamente.',
  });
}

async function mostrarDashboardAdmin(req, res) {
  const mensaje = req.query.mensaje || null;

  const { data: paquetes, error } = await supabase
    .from('paquetes')
    .select('id, folio, destino, estado, peso')
    .order('id', { ascending: false });

  if (error) {
    console.error('Supabase error fetching dashboard:', error);
    return res.render('admin-dashboard', {
      paquetes: [],
      mensaje: 'No se pudieron cargar los paquetes. Intenta nuevamente más tarde.',
    });
  }

  return res.render('admin-dashboard', {
    paquetes: paquetes || [],
    mensaje,
    paqueteriasCatalog: PAQUETERIAS_CATALOG,
  });
}

async function crearPaquete(req, res) {
  const folio = (req.body.folio || '').toString().trim();
  const destino = (req.body.destino || '').toString().trim();
  const peso = parseFloat(req.body.peso || '0');
  const estado = (req.body.estado || '').toString().trim();

  if (!folio || !destino || !estado || Number.isNaN(peso) || peso <= 0) {
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('Todos los campos son obligatorios y el peso debe ser mayor a 0.'));
  }

  if (!esPaqueteriaValida(destino) || !esPaqueteriaValida(estado)) {
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('Selecciona un destino y ubicación válidos.'));
  }

  const { error } = await supabase
    .from('paquetes')
    .insert([{ folio, destino, estado, peso }]);

  if (error) {
    console.error('Supabase error creating package:', error);
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('No se pudo crear el paquete.'));
  }

  const { fecha, hora } = getFechaHoraStrings();
  const historialInsert = await supabase
    .from(HISTORIAL_TABLE)
    .insert([{ folio, fecha, hora, ubicacion: estado, evento: 'Paquete creado' }]);

  if (historialInsert.error) {
    console.error('Supabase error creating package history:', historialInsert.error);
  }

  return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('Paquete creado correctamente.'));
}

async function actualizarEstado(req, res) {
  const folio = (req.body.folio || '').toString().trim();
  const estado = (req.body.estado || '').toString().trim();

  if (!folio || !estado) {
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('Folio y nueva ubicación son requeridos para la actualización.'));
  }

  if (!esPaqueteriaValida(estado)) {
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('Selecciona una ubicación válida para la actualización.'));
  }

  const { data, error } = await supabase
    .from('paquetes')
    .update({ estado })
    .eq('folio', folio)
    .select();

  if (error) {
    console.error('Supabase error updating package:', error);
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('No se pudo actualizar el paquete.'));
  }

  if (!data || data.length === 0) {
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('No se encontró el paquete para actualizar.'));
  }

  const { fecha, hora } = getFechaHoraStrings();
  const historialInsert = await supabase
    .from(HISTORIAL_TABLE)
    .insert([{ folio, fecha, hora, ubicacion: estado, evento: 'Estado actualizado' }]);

  if (historialInsert.error) {
    console.error('Supabase error creating update history:', historialInsert.error);
  }

  return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('Estado actualizado con éxito.'));
}

async function eliminarPaquete(req, res) {
  const folio = (req.body.folio || '').toString().trim();

  if (!folio) {
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('Folio es requerido para eliminar.'));
  }

  const { data, error } = await supabase
    .from('paquetes')
    .delete()
    .eq('folio', folio)
    .select();

  if (error) {
    console.error('Supabase error deleting package:', error);
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('No se pudo eliminar el paquete.'));
  }

  if (!data || data.length === 0) {
    return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('No se encontró el paquete para eliminar.'));
  }

  return res.redirect('/admin/dashboard?rol=admin&auth=true&mensaje=' + encodeURIComponent('Paquete eliminado correctamente.'));
}

async function rastrearPaquete(req, res) {
  const folioRaw = req.body.folio || '';
  const folio = folioRaw.toString().trim();

  if (!folio) {
    return renderIndex(res, {
      mensaje: 'Por favor ingresa un folio válido para la búsqueda.',
    });
  }

  const { data, error } = await supabase
    .from('paquetes')
    .select('id, folio, destino, estado, peso')
    .eq('folio', folio)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Supabase error:', error);
    return renderIndex(res, {
      mensaje: 'Hubo un problema al consultar el paquete. Intenta de nuevo más tarde.',
    });
  }

  if (!data) {
    return renderIndex(res, {
      mensaje: 'No se encontró el folio solicitado.',
    });
  }

  let historial = [];
  const { data: historialData, error: historialError } = await supabase
    .from(HISTORIAL_TABLE)
    .select('*')
    .eq('folio', folio)
    .order('created_at', { ascending: true });

  if (historialError) {
    console.error('Supabase error fetching history:', historialError);

    const { data: fallbackHistorial, error: fallbackError } = await supabase
      .from(HISTORIAL_TABLE)
      .select('*')
      .eq('folio', folio)
      .order('id', { ascending: true });

    if (fallbackError) {
      console.error('Supabase fallback error fetching history by id:', fallbackError);
    } else {
      historial = fallbackHistorial || [];
    }
  } else {
    historial = historialData || [];
  }

  historial = historial.map((registro) => {
    const fechaHora = registro.created_at ? new Date(registro.created_at) : null;
    return {
      ...registro,
      fecha: fechaHora ? fechaHora.toISOString().slice(0, 10) : registro.fecha || '',
      hora: fechaHora ? fechaHora.toTimeString().slice(0, 8) : registro.hora || '',
    };
  });

  if (!historial.length) {
    const { fecha, hora } = getFechaHoraStrings();
    historial = [{
      fecha,
      hora,
      ubicacion: data.estado || data.destino || 'Ubicación inicial',
    }];
  }

  const ubicacionActual = historial[historial.length - 1]?.ubicacion || data.estado || data.destino;

  return res.render('rastreo', {
    paquete: data,
    historial,
    ubicacionActual,
  });
}

module.exports = {
  obtenerHome,
  mostrarLoginAdmin,
  loginAdmin,
  mostrarDashboardAdmin,
  crearPaquete,
  apiObtenerPaquetePorFolio,
  rastrearPaquete,
  actualizarEstado,
  eliminarPaquete,
};
