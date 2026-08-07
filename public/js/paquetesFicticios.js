(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.paquetesFicticios = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const paquetes = [
    {
      folio: 'ST-1001',
      destino: 'Ciudad de México',
      peso: 2.4,
      estado: 'En Recolección',
      remitente: 'María López',
      cliente: 'Cliente A'
    },
    {
      folio: 'ST-1002',
      destino: 'Guadalajara',
      peso: 5.1,
      estado: 'En Ruta',
      remitente: 'José Ramírez',
      cliente: 'Cliente B'
    },
    {
      folio: 'ST-1003',
      destino: 'Monterrey',
      peso: 1.8,
      estado: 'Entregado',
      remitente: 'Ana Torres',
      cliente: 'Cliente C'
    },
    {
      folio: 'ST-1004',
      destino: 'Puebla',
      peso: 3.2,
      estado: 'En Recolección',
      remitente: 'Luis Campos',
      cliente: 'Cliente D'
    },
    {
      folio: 'ST-1005',
      destino: 'Querétaro',
      peso: 4.6,
      estado: 'En Ruta',
      remitente: 'Sofía Vega',
      cliente: 'Cliente E'
    }
  ];

  function getPaquetes() {
    return paquetes;
  }

  function buscarPaquetePorFolio(folio) {
    const texto = (folio || '').toString().trim().toUpperCase();
    return paquetes.find((paquete) => paquete.folio.toUpperCase() === texto) || null;
  }

  function actualizarEstadoPaquete(folio, estado) {
    const paquete = buscarPaquetePorFolio(folio);
    if (!paquete) {
      return null;
    }

    paquete.estado = estado;
    return paquete;
  }

  return {
    paquetes,
    getPaquetes,
    buscarPaquetePorFolio,
    actualizarEstadoPaquete
  };
});
