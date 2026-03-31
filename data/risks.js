// Análisis de riesgo actualizado con eventos recientes
// Basado en los boletines institucionales

const RIESGOS_ACTUALES = {
  timestamp: new Date().toISOString(),
  eventos_recientes: [
    {
      protocolo: "Resolv USR",
      fecha: "2026-03-23",
      tipo: "EXPLOIT",
      severidad: "CRITICA",
      descripcion: "Exploit de $25M por minting privilegiado no autorizado. 80M tokens sin respaldo creados.",
      impacto: ["Fluid: $17M en bad debt", "Morpho curators: pérdidas directas", "Curve LPs: pérdidas"],
      estado: "EN RESOLUCIÓN",
      recomendacion: "EVITAR completamente USR y RLP hasta resolución completa"
    },
    {
      protocolo: "Moonwell",
      fecha: "2026-03-27",
      tipo: "GOVERNANCE ATTACK",
      severidad: "MEDIA",
      descripcion: "Compra de $1,800 en tokens permitió propuesta que amenaza $1M en fondos del protocolo.",
      estado: "ACTIVO",
      recomendacion: "Monitorear. Riesgo de gobernanza en sistemas de quórum bajo."
    },
    {
      protocolo: "Balancer",
      fecha: "2026-03-25",
      tipo: "REESTRUCTURACIÓN",
      severidad: "MEDIA",
      descripcion: "Recorte de equipo 50% tras exploit de noviembre 2025. Presupuesto reducido 34%.",
      estado: "ESTABILIZADO",
      recomendacion: "Cautela. Protocolo sobreviviendo pero recursos reducidos."
    }
  ],
  protocolos_seguros: {
    alta_confianza: [
      {
        nombre: "Morpho",
        razon: "Cero bad debt histórico. $11B+ en depósitos. Blockdaemon integrado. Apollo comprando tokens.",
        score: 9.2
      },
      {
        nombre: "Aave V3",
        razon: "$1 billón en préstamos acumulados. El más auditado de DeFi. V4 aprobado por DAO.",
        score: 9.5
      },
      {
        nombre: "Sky / MakerDAO",
        razon: "El más antiguo de DeFi. sUSDS creciendo 29.3%. Arquitectura probada por años.",
        score: 8.8
      }
    ],
    precaucion: [
      {
        nombre: "Protocolos con USR como colateral",
        razon: "Post-exploit Resolv. Verificar exposición antes de depositar.",
        score: 4.0
      },
      {
        nombre: "Protocolos nuevos sin auditoría",
        razon: "Siempre verificar auditorías antes de depositar capital significativo.",
        score: 5.0
      }
    ]
  }
};

async function analizarRiesgo(protocolo) {
  const nombreLower = protocolo?.toLowerCase() || "";
  
  // Buscar en eventos recientes
  const eventoActivo = RIESGOS_ACTUALES.eventos_recientes.find(
    e => e.protocolo.toLowerCase().includes(nombreLower)
  );
  
  // Buscar en protocolos seguros
  const protocoloSeguro = RIESGOS_ACTUALES.protocolos_seguros.alta_confianza.find(
    p => p.nombre.toLowerCase().includes(nombreLower)
  );
  
  const protocoloPrecaucion = RIESGOS_ACTUALES.protocolos_seguros.precaucion.find(
    p => p.nombre.toLowerCase().includes(nombreLower)
  );
  
  if (eventoActivo) {
    return {
      protocolo,
      nivel_riesgo: eventoActivo.severidad,
      alerta: true,
      evento: eventoActivo,
      recomendacion: eventoActivo.recomendacion
    };
  }
  
  if (protocoloSeguro) {
    return {
      protocolo,
      nivel_riesgo: "BAJO",
      alerta: false,
      score_confianza: protocoloSeguro.score,
      razon: protocoloSeguro.razon,
      recomendacion: "Protocolo con alta confianza basado en historial y auditorías."
    };
  }
  
  // Respuesta general si no hay datos específicos
  return {
    protocolo,
    nivel_riesgo: "DESCONOCIDO",
    alerta: true,
    recomendacion: "No hay datos suficientes. Verifica auditorías en DeFiLlama antes de depositar.",
    recursos: ["https://defillama.com/protocol/" + nombreLower, "https://tokenterminal.com"]
  };
}

async function obtenerResumenRiesgo() {
  return {
    exito: true,
    data: RIESGOS_ACTUALES,
    resumen: `${RIESGOS_ACTUALES.eventos_recientes.length} eventos activos. ` +
      `${RIESGOS_ACTUALES.protocolos_seguros.alta_confianza.length} protocolos de alta confianza identificados.`
  };
}

module.exports = { analizarRiesgo, obtenerResumenRiesgo };