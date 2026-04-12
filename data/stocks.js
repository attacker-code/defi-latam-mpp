const ACCIONES_TOKENIZADAS = {
  timestamp: new Date().toISOString(),
  last_updated: "April 11, 2026",
  ultima_actualizacion: "11 abril 2026",
  source: "Ondo Finance + Backed Finance + Franklin Templeton + Token Terminal",
  fuente: "Ondo Finance + Backed Finance + Franklin Templeton + Token Terminal",
  note_en: "Accessible from LATAM with just a crypto wallet. No broker account needed.",
  nota_importante: "Accesibles desde LATAM con solo una wallet. Sin cuenta de broker.",

  top_by_volume: [
    {
      ticker: "MSBT",
      name: "Morgan Stanley Bitcoin ETF",
      nombre: "ETF Bitcoin de Morgan Stanley",
      issuer: "Morgan Stanley / NYSE",
      emisor: "Morgan Stanley / NYSE",
      network: "NYSE Arca",
      red: "NYSE Arca",
      note_en: "Launched April 8, 2026. First BTC ETF from a major US investment bank. Lowest fees in market.",
      nota: "Lanzado 8 abril 2026. Primer ETF BTC de un gran banco de inversión estadounidense. Comisiones más bajas del mercado.",
      url: "https://www.morganstanley.com",
      kyc_required: true,
      requiere_kyc: true
    },
    {
      ticker: "deSPXA",
      name: "S&P 500 Index Fund Token",
      nombre: "Token Fondo Índice S&P 500",
      issuer: "Centrifuge + Janus Henderson",
      emisor: "Centrifuge + Janus Henderson",
      network: "Base (Aerodrome)",
      red: "Base (Aerodrome)",
      market_cap_usd: null,
      volume_30d: "$400K+ in first days",
      volumen_30d: "$400K+ en primeros días",
      note_en: "First 24/7 tradeable onchain S&P 500. Licensed by S&P Dow Jones Indices. Live on Aerodrome. Coming to Morpho as collateral via Steakhouse.",
      nota: "Primer S&P 500 en cadena negociable 24/7. Licenciado por S&P Dow Jones Indices. Activo en Aerodrome. Próximamente como colateral en Morpho via Steakhouse.",
      url: "https://centrifuge.io",
      kyc_required: false,
      requiere_kyc: false
    },
    {
      ticker: "CRCLon",
      name: "Circle (CRCL) Tokenized",
      nombre: "Circle (CRCL) tokenizado",
      issuer: "Ondo Finance",
      emisor: "Ondo Finance",
      network: "Ethereum / Base",
      red: "Ethereum / Base",
      market_cap_usd: 103700000,
      volume_30d_usd: 868300000,
      volumen_30d_usd: 868300000,
      note_en: "Circle fell 22% on CLARITY Act yield ban news. High trading activity. ARK bought $16M during dip.",
      nota: "Circle cayó 22% por prohibición de yield en Ley CLARITY. Alta actividad de trading. ARK compró $16M durante la caída.",
      url: "https://ondo.finance",
      kyc_required: false,
      requiere_kyc: false
    },
    {
      ticker: "QQQon",
      name: "QQQ ETF Tokenized (Nasdaq 100)",
      nombre: "QQQ ETF tokenizado (Nasdaq 100)",
      issuer: "Ondo Finance",
      emisor: "Ondo Finance",
      network: "Ethereum / Base / Solana",
      red: "Ethereum / Base / Solana",
      market_cap_usd: 27200000,
      volume_30d_usd: 451600000,
      volumen_30d_usd: 451600000,
      note_en: "Full Nasdaq 100 in a single position. 24/7 trading. No broker needed.",
      nota: "El Nasdaq 100 completo en una sola posición. Trading 24/7. Sin broker.",
      url: "https://ondo.finance",
      kyc_required: false,
      requiere_kyc: false
    },
    {
      ticker: "NVDAon",
      name: "Nvidia Tokenized",
      nombre: "Nvidia tokenizado",
      issuer: "Ondo Finance",
      emisor: "Ondo Finance",
      network: "Ethereum / Base",
      red: "Ethereum / Base",
      market_cap_usd: 27600000,
      note_en: "World's most valuable AI company in your wallet. No US broker account needed.",
      nota: "La empresa de IA más valiosa del mundo en tu wallet. Sin cuenta de broker americano.",
      url: "https://ondo.finance",
      kyc_required: false,
      requiere_kyc: false
    },
    {
      ticker: "TSLAx",
      name: "Tesla Tokenized",
      nombre: "Tesla tokenizado",
      issuer: "Backed Finance",
      emisor: "Backed Finance",
      network: "Ethereum",
      red: "Ethereum",
      market_cap_usd: 48100000,
      note_en: "Tesla shares without a US broker account. Full ownership rights.",
      nota: "Acciones de Tesla sin cuenta en broker americano. Derechos de propiedad completos.",
      url: "https://backed.fi",
      kyc_required: false,
      requiere_kyc: false
    },
    {
      ticker: "SPYon",
      name: "SPY ETF Tokenized (S&P 500)",
      nombre: "SPY ETF tokenizado (S&P 500)",
      issuer: "Ondo Finance",
      emisor: "Ondo Finance",
      network: "Ethereum / Base / Solana",
      red: "Ethereum / Base / Solana",
      market_cap_usd: 32800000,
      note_en: "S&P 500 in your wallet. No schedule. No restrictions. 24/7.",
      nota: "S&P 500 en tu wallet. Sin horario. Sin restricciones. 24/7.",
      url: "https://ondo.finance",
      kyc_required: false,
      requiere_kyc: false
    }
  ],

  new_this_week: {
    date: "April 8, 2026",
    fecha: "8 abril 2026",
    source: "Franklin Templeton + Ondo Finance + Securitize",
    description_en: "Franklin Templeton and Ondo launched 60+ tokenized ETFs with 24/7 trading via crypto wallets. Securitize tokenized Currenc Group shares on Ethereum and Solana. NYSE named Securitize first digital transfer agent.",
    descripcion: "Franklin Templeton y Ondo lanzaron 60+ ETFs tokenizados con trading 24/7 via wallets crypto. Securitize tokenizó acciones de Currenc Group en Ethereum y Solana. NYSE nombró a Securitize primer agente de transferencia digital.",
    new_sectors: ["AI", "Oil", "Data", "Space", "Biotech", "Defense", "Quantum Computing"],
    nuevos_sectores: ["IA", "Petróleo", "Datos", "Espacio", "Biotech", "Defensa", "Computación cuántica"],
    total_new_assets: 60,
    total_nuevos_activos: 60
  },

  rwa_market: {
    note_en: "Ondo Finance crossed $3.5B TVL. USDY +$463.4M inflows this week. Institutional demand growing fast.",
    nota: "Ondo Finance superó $3.5B en TVL. USDY +$463.4M de entradas esta semana. Demanda institucional creciendo rápido.",
    total_rwa_tvl: "$3.5B+ (Ondo alone)",
    total_rwa_tvl_es: "$3.5B+ (solo Ondo)"
  },

  latam_guide: {
    country: "Ecuador and LATAM",
    pais: "Ecuador y LATAM",
    steps_en: [
      "1. Open MetaMask on your computer",
      "2. Buy USDC on Binance via P2P",
      "3. Withdraw USDC to your MetaMask",
      "4. Go to ondo.finance, backed.fi or centrifuge.io",
      "5. Connect your wallet",
      "6. Buy the tokenized stock you want",
      "7. Stock arrives in your wallet in seconds"
    ],
    pasos: [
      "1. Abre MetaMask en tu computadora",
      "2. Compra USDC en Binance via P2P",
      "3. Retira USDC a tu MetaMask",
      "4. Ve a ondo.finance, backed.fi o centrifuge.io",
      "5. Conecta tu wallet",
      "6. Compra la acción tokenizada que quieras",
      "7. La acción llega a tu wallet en segundos"
    ],
    advantages_en: [
      "No US broker account needed",
      "24/7 trading — no market hours",
      "No high minimums",
      "Full ownership rights",
      "Instant liquidity"
    ],
    ventajas: [
      "Sin cuenta de broker americano",
      "Trading 24/7 — sin horario de mercado",
      "Sin mínimos altos",
      "Derechos de propiedad completos",
      "Liquidez inmediata"
    ]
  }
};

async function obtenerAcciones(filtro) {
  let acciones = ACCIONES_TOKENIZADAS.top_by_volume;

  if (filtro) {
    acciones = acciones.filter(a =>
      a.ticker.toLowerCase().includes(filtro.toLowerCase()) ||
      a.name.toLowerCase().includes(filtro.toLowerCase()) ||
      a.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  return {
    exito: true,
    success: true,
    data: {
      stocks: acciones,
      acciones,
      new_this_week: ACCIONES_TOKENIZADAS.new_this_week,
      nuevos_esta_semana: ACCIONES_TOKENIZADAS.new_this_week,
      rwa_market: ACCIONES_TOKENIZADAS.rwa_market,
      latam_guide: ACCIONES_TOKENIZADAS.latam_guide,
      guia_latam: ACCIONES_TOKENIZADAS.latam_guide
    },
    summary: `${acciones.length} tokenized stocks available from LATAM. 60+ new assets launched this week by Franklin Templeton and Ondo.`,
    resumen: `${acciones.length} acciones tokenizadas disponibles desde LATAM. 60+ nuevas lanzadas esta semana por Franklin Templeton y Ondo.`
  };
}

module.exports = { obtenerAcciones, ACCIONES_TOKENIZADAS };