const RIESGOS_ACTUALES = {
  timestamp: new Date().toISOString(),
  last_updated: "April 11, 2026",
  ultima_actualizacion: "11 abril 2026",

  recent_events: [
    {
      protocol: "Drift Protocol",
      protocolo: "Drift Protocol",
      date: "2026-04-01",
      fecha: "2026-04-01",
      type: "HACK",
      tipo: "HACK",
      severity: "CRITICAL",
      severidad: "CRITICA",
      description_en: "$285M drained in 12 minutes. Attackers used social engineering to compromise admin keys weeks before execution. North Korean state-linked actors attributed by Elliptic and TRM Labs.",
      descripcion: "Hack de $285M en 12 minutos. Ingeniería social comprometió claves de administrador semanas antes. Atribuido a actores vinculados a Corea del Norte.",
      status: "CONFIRMED",
      estado: "CONFIRMADO",
      recommendation_en: "AVOID Drift until full audit and restitution. Code was audited — breach was operational, not technical.",
      recomendacion: "EVITAR Drift hasta auditoría completa. El código estaba auditado — la brecha fue operacional, no técnica.",
      lesson: "Audit-passed does not mean operationally secure. Governance risk is real."
    },
    {
      protocol: "Dolomite (WLFI Collateral)",
      protocolo: "Dolomite (Colateral WLFI)",
      date: "2026-04-09",
      fecha: "2026-04-09",
      type: "LIQUIDITY RISK",
      tipo: "RIESGO DE LIQUIDEZ",
      severity: "HIGH",
      severidad: "ALTA",
      description_en: "World Liberty Fi (Trump family project) deposited $484M in illiquid WLFI tokens as collateral to borrow USDC. If position approaches liquidation, bad debt risk is extreme.",
      descripcion: "World Liberty Fi depositó $484M en tokens WLFI ilíquidos como colateral para pedir prestado USDC. Si la posición se acerca a liquidación, riesgo de bad debt es extremo.",
      status: "ACTIVE",
      estado: "ACTIVO",
      recommendation_en: "WITHDRAW stablecoin deposits from WLFI-collateral pools on Dolomite immediately.",
      recomendacion: "RETIRAR depósitos de stablecoins de pools con colateral WLFI en Dolomite inmediatamente."
    },
    {
      protocol: "Seamless Protocol (Base)",
      protocolo: "Seamless Protocol (Base)",
      date: "2026-04-09",
      fecha: "2026-04-09",
      type: "SHUTDOWN",
      tipo: "CIERRE",
      severity: "MEDIUM",
      severidad: "MEDIA",
      description_en: "Shutting down after 2.5 years. Failed to find product-market fit. UI goes offline June 30, 2026.",
      descripcion: "Cerrando después de 2.5 años. No encontró product-market fit. UI offline el 30 junio 2026.",
      status: "CONFIRMED",
      estado: "CONFIRMADO",
      recommendation_en: "WITHDRAW all assets before June 30, 2026.",
      recomendacion: "RETIRAR todos los activos antes del 30 junio 2026."
    },
    {
      protocol: "Aave — Chaos Labs Exit",
      protocolo: "Aave — Salida de Chaos Labs",
      date: "2026-04-07",
      fecha: "2026-04-07",
      type: "GOVERNANCE",
      tipo: "GOBERNANZA",
      severity: "LOW",
      severidad: "BAJA",
      description_en: "Chaos Labs resigned as Aave risk manager after 3 years citing unsustainable economics. LlamaRisk takes over as sole risk manager with increased budget.",
      descripcion: "Chaos Labs renunció como gestor de riesgo de Aave tras 3 años. LlamaRisk asume como gestor único con mayor presupuesto.",
      status: "RESOLVED",
      estado: "RESUELTO",
      recommendation_en: "Aave remains safe. LlamaRisk is a qualified replacement. Monitor transition period.",
      recomendacion: "Aave sigue siendo seguro. LlamaRisk es un reemplazo calificado. Monitorear el período de transición."
    },
    {
      protocol: "Steakhouse Financial",
      protocolo: "Steakhouse Financial",
      date: "2026-04-08",
      fecha: "2026-04-08",
      type: "PHISHING",
      tipo: "PHISHING",
      severity: "HIGH",
      severidad: "ALTA",
      description_en: "Phishing attack redirected domain to malicious site via DNS provider social engineering. All depositor funds and contracts remain safe.",
      descripcion: "Ataque de phishing redirigió el dominio a un sitio malicioso via ingeniería social al proveedor DNS. Fondos y contratos siguen seguros.",
      status: "RESOLVED",
      estado: "RESUELTO",
      recommendation_en: "Always verify URLs before interacting. Use bookmarks for DeFi protocols.",
      recomendacion: "Siempre verificar URLs antes de interactuar. Usar marcadores para protocolos DeFi."
    },
    {
      protocol: "Bitcoin — Quantum Risk",
      protocolo: "Bitcoin — Riesgo Cuántico",
      date: "2026-04-05",
      fecha: "2026-04-05",
      type: "SYSTEMIC RISK",
      tipo: "RIESGO SISTÉMICO",
      severity: "MEDIUM",
      severidad: "MEDIA",
      description_en: "Google research shows 20x efficiency improvement breaking ECDSA encryption. Timeline moved from mid-2030s to potentially 2029. ~1/3 of all Bitcoin (including Satoshi's coins) in exposed addresses.",
      descripcion: "Investigación de Google muestra mejora 20x en romper cifrado ECDSA. Timeline adelantado de mediados de 2030s a posiblemente 2029. ~1/3 de todo el Bitcoin en direcciones expuestas.",
      status: "MONITORING",
      estado: "MONITOREANDO",
      recommendation_en: "Move BTC to quantum-resistant addresses when available. Monitor Bitcoin developer community response.",
      recomendacion: "Mover BTC a direcciones resistentes a computación cuántica cuando estén disponibles. Monitorear respuesta de la comunidad de desarrollo de Bitcoin."
    },
    {
      protocol: "Resolv USR",
      protocolo: "Resolv USR",
      date: "2026-03-23",
      fecha: "2026-03-23",
      type: "EXPLOIT",
      tipo: "EXPLOIT",
      severity: "CRITICAL",
      severidad: "CRITICA",
      description_en: "$25M exploit via unauthorized privileged minting. 80M unbacked tokens created. Fluid: $17M bad debt. Morpho curators: direct losses.",
      descripcion: "Exploit de $25M por minting privilegiado no autorizado. 80M tokens sin respaldo creados. Fluid: $17M bad debt. Morpho curators: pérdidas directas.",
      status: "RESOLVING",
      estado: "EN RESOLUCIÓN",
      recommendation_en: "AVOID USR and RLP completely until full resolution.",
      recomendacion: "EVITAR completamente USR y RLP hasta resolución completa."
    }
  ],

  trusted_protocols: {
    high_confidence: [
      {
        name: "Morpho",
        nombre: "Morpho",
        reason_en: "Zero bad debt history. $11B+ in deposits. Ethereum Foundation added 3,400 ETH to Morpho Vaults. Fixed-rate lending coming soon. Apollo Global partnership.",
        razon: "Cero bad debt histórico. $11B+ en depósitos. Ethereum Foundation agregó 3,400 ETH a Morpho Vaults. Préstamos a tasa fija próximamente. Partnership con Apollo Global.",
        score: 9.4,
        updated: "April 11, 2026"
      },
      {
        name: "Aave V4",
        nombre: "Aave V4",
        reason_en: "Over $1 trillion in cumulative loans originated. Most audited DeFi protocol. V4 hub-and-spoke architecture isolates risk. LlamaRisk now sole risk manager.",
        razon: "Más de $1 billón en préstamos acumulados. El más auditado de DeFi. Arquitectura V4 hub-and-spoke aísla riesgos. LlamaRisk ahora gestor único.",
        score: 9.3,
        updated: "April 11, 2026"
      },
      {
        name: "Sky / MakerDAO",
        nombre: "Sky / MakerDAO",
        reason_en: "Oldest DeFi protocol. sUSDS at $6.9B supply — nearly double closest competitor. Proven architecture through multiple market cycles.",
        razon: "El protocolo DeFi más antiguo. sUSDS en $6.9B — casi el doble del competidor más cercano. Arquitectura probada en múltiples ciclos de mercado.",
        score: 8.9,
        updated: "April 11, 2026"
      },
      {
        name: "Pendle Finance",
        nombre: "Pendle Finance",
        reason_en: "MCP integration for AI agents. Expanding to Solana. 100% APR limit order incentives. Strong institutional backing.",
        razon: "Integración MCP para agentes de IA. Expandiendo a Solana. 100% APR en incentivos de órdenes límite. Fuerte respaldo institucional.",
        score: 8.5,
        updated: "April 11, 2026"
      }
    ],
    caution: [
      {
        name: "Dolomite (WLFI pools)",
        nombre: "Dolomite (pools WLFI)",
        reason_en: "Illiquid WLFI collateral risk. $484M Trump family position could cause bad debt cascade.",
        razon: "Riesgo de colateral WLFI ilíquido. Posición de $484M del equipo Trump podría causar cascada de bad debt.",
        score: 3.5
      },
      {
        name: "New protocols without audit",
        nombre: "Protocolos nuevos sin auditoría",
        reason_en: "Always verify audits on DeFiLlama before depositing significant capital.",
        razon: "Siempre verificar auditorías en DeFiLlama antes de depositar capital significativo.",
        score: 4.0
      },
      {
        name: "Protocols with admin key risk",
        nombre: "Protocolos con riesgo de claves admin",
        reason_en: "Drift hack proved audit-passed ≠ operationally secure. Check multisig configuration and timelock settings.",
        razon: "Hack de Drift probó que código auditado ≠ seguro operacionalmente. Verificar configuración de multisig y timelock.",
        score: 5.0
      }
    ]
  },

  defi_insurance: {
    recommendation_en: "Post-Drift hack, DeFi insurance is more important than ever.",
    recomendacion: "Post-hack de Drift, el seguro DeFi es más importante que nunca.",
    provider: "OpenCover (Nexus Mutual)",
    url: "https://opencover.com",
    note_en: "Covered Vaults launched: up to $50M cover capacity per vault. Premiums streamed from yield — no upfront payment.",
    nota: "Covered Vaults lanzado: hasta $50M de cobertura por vault. Primas pagadas desde el yield — sin pago anticipado."
  }
};

async function analizarRiesgo(protocolo) {
  const nombreLower = protocolo?.toLowerCase() || "";

  const eventoActivo = RIESGOS_ACTUALES.recent_events.find(
    e => e.protocol.toLowerCase().includes(nombreLower) ||
         e.protocolo.toLowerCase().includes(nombreLower)
  );

  const protocoloSeguro = RIESGOS_ACTUALES.trusted_protocols.high_confidence.find(
    p => p.name.toLowerCase().includes(nombreLower) ||
         p.nombre.toLowerCase().includes(nombreLower)
  );

  const protocoloPrecaucion = RIESGOS_ACTUALES.trusted_protocols.caution.find(
    p => p.name.toLowerCase().includes(nombreLower) ||
         p.nombre.toLowerCase().includes(nombreLower)
  );

  if (eventoActivo) {
    return {
      protocol: protocolo,
      protocolo,
      risk_level: eventoActivo.severity,
      nivel_riesgo: eventoActivo.severidad,
      alert: true,
      alerta: true,
      event: eventoActivo,
      evento: eventoActivo,
      recommendation_en: eventoActivo.recommendation_en,
      recomendacion: eventoActivo.recomendacion
    };
  }

  if (protocoloSeguro) {
    return {
      protocol: protocolo,
      protocolo,
      risk_level: "LOW",
      nivel_riesgo: "BAJO",
      alert: false,
      alerta: false,
      confidence_score: protocoloSeguro.score,
      score_confianza: protocoloSeguro.score,
      reason_en: protocoloSeguro.reason_en,
      razon: protocoloSeguro.razon,
      recommendation_en: "High confidence protocol based on track record and audits.",
      recomendacion: "Protocolo de alta confianza basado en historial y auditorías."
    };
  }

  if (protocoloPrecaucion) {
    return {
      protocol: protocolo,
      protocolo,
      risk_level: "HIGH",
      nivel_riesgo: "ALTO",
      alert: true,
      alerta: true,
      reason_en: protocoloPrecaucion.reason_en,
      razon: protocoloPrecaucion.razon,
      recommendation_en: "Proceed with extreme caution.",
      recomendacion: "Proceder con extrema precaución."
    };
  }

  return {
    protocol: protocolo,
    protocolo,
    risk_level: "UNKNOWN",
    nivel_riesgo: "DESCONOCIDO",
    alert: true,
    alerta: true,
    recommendation_en: "Insufficient data. Verify audits on DeFiLlama before depositing.",
    recomendacion: "Datos insuficientes. Verifica auditorías en DeFiLlama antes de depositar.",
    resources: [
      "https://defillama.com/protocol/" + nombreLower,
      "https://tokenterminal.com",
      "https://opencover.com"
    ]
  };
}

async function obtenerResumenRiesgo() {
  const critical = RIESGOS_ACTUALES.recent_events.filter(
    e => e.severity === "CRITICAL"
  ).length;

  return {
    exito: true,
    success: true,
    data: RIESGOS_ACTUALES,
    summary: `${RIESGOS_ACTUALES.recent_events.length} active risk events. ${critical} critical. ${RIESGOS_ACTUALES.trusted_protocols.high_confidence.length} high-confidence protocols identified.`,
    resumen: `${RIESGOS_ACTUALES.recent_events.length} eventos de riesgo activos. ${critical} críticos. ${RIESGOS_ACTUALES.trusted_protocols.high_confidence.length} protocolos de alta confianza identificados.`
  };
}

module.exports = { analizarRiesgo, obtenerResumenRiesgo };