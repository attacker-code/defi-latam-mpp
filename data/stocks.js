// Acciones tokenizadas disponibles desde LATAM sin broker americano
// Basado en datos de Token Terminal y boletines institucionales

const ACCIONES_TOKENIZADAS = {
  timestamp: new Date().toISOString(),
  fuente: "Ondo Finance + Backed Finance + Token Terminal",
  nota_importante: "Accesibles desde LATAM con solo una wallet. Sin cuenta de broker.",
  
  // Datos de Token Terminal (26 marzo 2026)
  top_por_volumen: [
    {
      ticker: "CRCLon",
      nombre: "Circle (CRCL) tokenizado",
      emisor: "Ondo Finance",
      market_cap_usd: 103700000,
      volumen_30d_usd: 868300000,
      ratio_vol_mc: 8.4,
      nota: "Circle cayó 20% por Ley Claridad. Alta actividad de trading.",
      wallet_necesaria: "MetaMask o Phantom",
      url: "https://ondo.finance"
    },
    {
      ticker: "TSLAx",
      nombre: "Tesla tokenizado",
      emisor: "Backed Finance",
      market_cap_usd: 48100000,
      volumen_30d_usd: null,
      nota: "Acciones de Tesla sin cuenta en broker americano",
      wallet_necesaria: "MetaMask",
      url: "https://backed.fi"
    },
    {
      ticker: "SPYon",
      nombre: "SPY ETF tokenizado",
      emisor: "Ondo Finance",
      market_cap_usd: 32800000,
      volumen_30d_usd: null,
      nota: "S&P 500 en tu wallet. Sin horario. Sin restricciones.",
      wallet_necesaria: "MetaMask o Phantom",
      url: "https://ondo.finance"
    },
    {
      ticker: "GOOGLon",
      nombre: "Google tokenizado",
      emisor: "Ondo Finance",
      market_cap_usd: 31900000,
      volumen_30d_usd: null,
      nota: "Acciones de Alphabet/Google on-chain",
      wallet_necesaria: "MetaMask o Phantom",
      url: "https://ondo.finance"
    },
    {
      ticker: "NVDAon",
      nombre: "Nvidia tokenizado",
      emisor: "Ondo Finance",
      market_cap_usd: 27600000,
      volumen_30d_usd: null,
      nota: "La empresa más valiosa del mundo en tu wallet",
      wallet_necesaria: "MetaMask o Phantom",
      url: "https://ondo.finance"
    },
    {
      ticker: "QQQon",
      nombre: "QQQ ETF tokenizado (Nasdaq)",
      emisor: "Ondo Finance",
      market_cap_usd: 27200000,
      volumen_30d_usd: 451600000,
      ratio_vol_mc: 16.6,
      nota: "El Nasdaq 100 completo en una sola posición",
      wallet_necesaria: "MetaMask o Phantom",
      url: "https://ondo.finance"
    }
  ],
  
  // Nuevos lanzamientos de esta semana
  nuevos_esta_semana: {
    fecha: "2026-03-27",
    fuente: "Franklin Templeton + Ondo Finance",
    descripcion: "Franklin Templeton y Ondo lanzaron ETFs tokenizados con trading 24/7 via wallets crypto",
    sectores_nuevos: ["IA", "Petróleo", "Datos", "Espacio", "Biotech", "Defensa", "Computación cuántica"],
    total_nuevos_activos: 60,
    nota: "60+ nuevas acciones tokenizadas lanzadas esta semana. El mercado está expandiéndose rápido."
  },
  
  // Cómo acceder desde Ecuador
  guia_latam: {
    pais: "Ecuador (y LATAM en general)",
    pasos: [
      "1. Abre MetaMask en tu computadora",
      "2. Compra USDC en Binance via P2P (ya sabes hacerlo)",
      "3. Retira USDC a tu MetaMask",
      "4. Ve a ondo.finance o backed.fi",
      "5. Conecta tu wallet",
      "6. Compra la acción tokenizada que quieras",
      "7. La acción llega a tu wallet en segundos"
    ],
    ventajas: [
      "Sin cuenta de broker americano",
      "Sin horario (24/7/365)",
      "Sin mínimos altos",
      "Mismos derechos de voto y dividendos",
      "Liquidez inmediata"
    ],
    restricciones: [
      "Algunos requieren verificación KYC básica",
      "Verificar disponibilidad por país específico",
      "El marco regulatorio aún en desarrollo"
    ]
  }
};

async function obtenerAcciones(filtro) {
  let acciones = ACCIONES_TOKENIZADAS.top_por_volumen;
  
  if (filtro) {
    acciones = acciones.filter(a => 
      a.ticker.toLowerCase().includes(filtro.toLowerCase()) ||
      a.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }
  
  return {
    exito: true,
    data: {
      acciones,
      nuevos_esta_semana: ACCIONES_TOKENIZADAS.nuevos_esta_semana,
      guia_latam: ACCIONES_TOKENIZADAS.guia_latam
    },
    resumen: `${acciones.length} acciones tokenizadas disponibles desde LATAM. ` +
      `60+ nuevas lanzadas esta semana por Franklin Templeton y Ondo.`
  };
}

module.exports = { obtenerAcciones, ACCIONES_TOKENIZADAS };