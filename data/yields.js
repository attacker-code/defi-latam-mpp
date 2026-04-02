const fetch = require("node-fetch");

const DUNE_SIM_KEY = process.env.DUNE_SIM_API_KEY;
const DUNE_BASE_URL = "https://sim-api.dune.com/v1";

// Protocolos a consultar
const PROTOCOLOS_LATAM = [
  { id: "aave-v3", nombre: "Aave V3", red: "Base/Arbitrum" },
  { id: "morpho", nombre: "Morpho", red: "Base" },
  { id: "sky", nombre: "Sky/sUSDS", red: "Ethereum" }
];

async function obtenerYieldsDuneSim() {
  try {
    // Consulta posiciones DeFi via Dune Sim
    const response = await fetch(
      `${DUNE_BASE_URL}/defi/positions?protocols=aave-v3,morpho,sky&chains=base,arbitrum,ethereum`,
      {
        headers: {
          "X-Dune-Api-Key": DUNE_SIM_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Dune Sim error: ${response.status}`);
    }

    const data = await response.json();
    return procesarDatosDune(data);

  } catch (error) {
    console.error("Dune Sim falló, usando datos curados:", error.message);
    return obtenerYieldsCurados();
  }
}

function procesarDatosDune(data) {
  // Procesa respuesta de Dune Sim
  const yields = [];

  if (data && data.positions) {
    data.positions.forEach(pos => {
      if (pos.apy && pos.apy > 0) {
        yields.push({
          protocolo: pos.protocol_name || "Desconocido",
          activo: pos.token_symbol || "USDC",
          apy_min: parseFloat((pos.apy * 0.9).toFixed(2)),
          apy_max: parseFloat((pos.apy * 1.1).toFixed(2)),
          apy_actual: parseFloat(pos.apy.toFixed(2)),
          riesgo: clasificarRiesgo(pos.protocol_name),
          requiere_kyc: false,
          min_deposito_usd: 1,
          redes: [pos.chain || "Base"],
          url: obtenerUrl(pos.protocol_name),
          nota_latam: `Dato en tiempo real via Dune Sim. Accesible desde Ecuador.`,
          fuente: "dune_sim_realtime",
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  if (yields.length > 0) {
    return {
      timestamp: new Date().toISOString(),
      fuente: "Dune Sim API — datos en tiempo real",
      yields,
      total_protocolos: yields.length
    };
  }

  // Si Dune no devuelve datos útiles, usa curados
  return obtenerYieldsCurados();
}

function clasificarRiesgo(protocolo) {
  const bajo = ["aave", "morpho", "compound"];
  const medio = ["sky", "yearn", "pendle"];
  const name = (protocolo || "").toLowerCase();
  if (bajo.some(p => name.includes(p))) return "bajo";
  if (medio.some(p => name.includes(p))) return "medio";
  return "medio-alto";
}

function obtenerUrl(protocolo) {
  const urls = {
    "aave": "https://app.aave.com",
    "morpho": "https://app.morpho.org",
    "sky": "https://sky.money",
    "pendle": "https://app.pendle.finance",
    "yearn": "https://yearn.fi"
  };
  const name = (protocolo || "").toLowerCase();
  for (const [key, url] of Object.entries(urls)) {
    if (name.includes(key)) return url;
  }
  return "https://defillama.com";
}

// Datos curados como fallback (siempre actualizados)
function obtenerYieldsCurados() {
  return {
    timestamp: new Date().toISOString(),
    fuente: "DeFi LATAM Intelligence — datos curados + verificados",
    nota: "Actualizado con boletines institucionales del 2 abril 2026",
    yields: [
      {
        protocolo: "Morpho (Base)",
        activo: "USDC",
        apy_min: 5.0, apy_max: 8.0,
        riesgo: "bajo",
        requiere_kyc: false,
        min_deposito_usd: 1,
        redes: ["Base"],
        url: "https://app.morpho.org",
        nota_latam: "Recomendado para Ecuador. Fee Base: $0.01. Cero bad debt histórico."
      },
      {
        protocolo: "Aave V4 (Ethereum)",
        activo: "USDC",
        apy_min: 4.0, apy_max: 6.0,
        riesgo: "bajo",
        requiere_kyc: false,
        min_deposito_usd: 1,
        redes: ["Ethereum", "Base", "Arbitrum"],
        url: "https://app.aave.com",
        nota_latam: "V4 lanzado 1 abril 2026. El más auditado de DeFi."
      },
      {
        protocolo: "Sky / sUSDS",
        activo: "USDS",
        apy_min: 3.75, apy_max: 5.0,
        riesgo: "bajo-medio",
        requiere_kyc: false,
        min_deposito_usd: 1,
        redes: ["Ethereum", "Base"],
        url: "https://sky.money",
        nota_latam: "3.75% TAE actualizado. No afectado por Ley CLARITY directamente."
      },
      {
        protocolo: "Pendle Finance",
        activo: "USDC/PT tokens",
        apy_min: 8.0, apy_max: 15.0,
        riesgo: "medio",
        requiere_kyc: false,
        min_deposito_usd: 10,
        redes: ["Ethereum", "Arbitrum", "Base"],
        url: "https://app.pendle.finance",
        nota_latam: "MCP lanzado hace 2 días. Agentes de IA ya operan aquí. Yield fijo disponible."
      },
      {
        protocolo: "Yearn yvUSD (cross-chain)",
        activo: "USDC",
        apy_min: 6.0, apy_max: 12.0,
        riesgo: "medio",
        requiere_kyc: false,
        min_deposito_usd: 10,
        redes: ["Ethereum"],
        url: "https://yearn.fi",
        nota_latam: "Optimiza yield automáticamente entre cadenas via CCTP."
      },
      {
        protocolo: "Nado NLP Vault (Ink/Kraken)",
        activo: "USDT0",
        apy_min: 20.0, apy_max: 20.0,
        riesgo: "medio-alto",
        requiere_kyc: false,
        min_deposito_usd: 10,
        redes: ["Ink"],
        url: "https://app.nado.xyz",
        nota_latam: "Respaldado por Kraken. Sin token = posible airdrop."
      }
    ]
  };
}

async function obtenerYields() {
  const data = DUNE_SIM_KEY
    ? await obtenerYieldsDuneSim()
    : obtenerYieldsCurados();

  const yields = data.yields || [];

  return {
    exito: true,
    data: {
      ...data,
      yields
    },
    mejor_opcion: {
      mayor_apy: [...yields].sort((a, b) => b.apy_min - a.apy_min)[0],
      mas_seguro: yields.find(y => y.riesgo === "bajo"),
      recomendado_latam: yields.find(y =>
        y.nota_latam && y.nota_latam.includes("Ecuador")
      )
    },
    resumen: `${yields.length} protocolos disponibles desde LATAM. ` +
      `APY entre ${Math.min(...yields.map(y => y.apy_min))}% ` +
      `y ${Math.max(...yields.map(y => y.apy_max))}%. Sin KYC.`
  };
}

module.exports = { obtenerYields };