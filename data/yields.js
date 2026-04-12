const fetch = require("node-fetch");

const DUNE_SIM_KEY = process.env.DUNE_SIM_API_KEY;
const DUNE_BASE_URL = "https://sim-api.dune.com/v1";

async function obtenerYieldsDuneSim() {
  try {
    const response = await fetch(
      `${DUNE_BASE_URL}/defi/positions?protocols=aave-v3,morpho,sky&chains=base,arbitrum,ethereum`,
      {
        headers: {
          "X-Dune-Api-Key": DUNE_SIM_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) throw new Error(`Dune Sim error: ${response.status}`);
    const data = await response.json();
    return procesarDatosDune(data);
  } catch (error) {
    console.error("Dune Sim falló, usando datos curados:", error.message);
    return obtenerYieldsCurados();
  }
}

function procesarDatosDune(data) {
  const yields = [];
  if (data && data.positions) {
    data.positions.forEach(pos => {
      if (pos.apy && pos.apy > 0) {
        yields.push({
          protocol: pos.protocol_name || "Unknown",
          protocolo: pos.protocol_name || "Desconocido",
          asset: pos.token_symbol || "USDC",
          activo: pos.token_symbol || "USDC",
          apy_min: parseFloat((pos.apy * 0.9).toFixed(2)),
          apy_max: parseFloat((pos.apy * 1.1).toFixed(2)),
          apy_current: parseFloat(pos.apy.toFixed(2)),
          risk: clasificarRiesgo(pos.protocol_name),
          riesgo: clasificarRiesgo(pos.protocol_name),
          kyc_required: false,
          requiere_kyc: false,
          min_deposit_usd: 1,
          min_deposito_usd: 1,
          networks: [pos.chain || "Base"],
          redes: [pos.chain || "Base"],
          url: obtenerUrl(pos.protocol_name),
          note_en: `Real-time data via Dune Sim. Accessible from LATAM.`,
          nota_latam: `Dato en tiempo real via Dune Sim. Accesible desde Ecuador.`,
          source: "dune_sim_realtime",
          fuente: "dune_sim_realtime",
          timestamp: new Date().toISOString()
        });
      }
    });
  }
  if (yields.length > 0) {
    return { yields, total: yields.length };
  }
  return obtenerYieldsCurados();
}

function clasificarRiesgo(protocolo) {
  const bajo = ["aave", "morpho", "compound"];
  const medio = ["sky", "yearn", "pendle"];
  const name = (protocolo || "").toLowerCase();
  if (bajo.some(p => name.includes(p))) return "low";
  if (medio.some(p => name.includes(p))) return "medium";
  return "medium-high";
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

function obtenerYieldsCurados() {
  return {
    timestamp: new Date().toISOString(),
    source: "DeFi LATAM Intelligence — curated + verified data",
    fuente: "DeFi LATAM Intelligence — datos curados + verificados",
    last_updated: "April 11, 2026",
    ultima_actualizacion: "11 abril 2026",
    yields: [
      {
        protocol: "Morpho (Base)",
        protocolo: "Morpho (Base)",
        asset: "USDC",
        activo: "USDC",
        apy_min: 5.0, apy_max: 8.0,
        risk: "low",
        riesgo: "bajo",
        kyc_required: false,
        requiere_kyc: false,
        min_deposit_usd: 1,
        min_deposito_usd: 1,
        networks: ["Base"],
        redes: ["Base"],
        url: "https://app.morpho.org",
        note_en: "Top DeFi lending on Base. Zero bad debt history. $0.01 gas fee. Recommended for LATAM users.",
        nota_latam: "Recomendado para Ecuador. Fee Base: $0.01. Cero bad debt histórico.",
        catalyst: "Ethereum Foundation added 3,400 ETH to Morpho Vaults. Fixed-rate lending coming soon."
      },
      {
        protocol: "Reservoir wsrUSD (Morpho/Monad)",
        protocolo: "Reservoir wsrUSD (Morpho/Monad)",
        asset: "srUSD",
        activo: "srUSD",
        apy_min: 18.0, apy_max: 20.0,
        risk: "medium",
        riesgo: "medio",
        kyc_required: false,
        requiere_kyc: false,
        min_deposit_usd: 10,
        min_deposito_usd: 10,
        networks: ["Monad"],
        redes: ["Monad"],
        url: "https://reservoir.xyz",
        note_en: "CDP stablecoin nearly doubled TVL in one month. 20% looping APY on Morpho Monad.",
        nota_latam: "Stablecoin CDP con casi el doble de TVL en un mes. 20% APY en Morpho Monad.",
        catalyst: "TVL +97.67% in one month. Highest yield in the current market."
      },
      {
        protocol: "Saturn sUSDat",
        protocolo: "Saturn sUSDat",
        asset: "sUSDat",
        activo: "sUSDat",
        apy_min: 11.5, apy_max: 20.0,
        risk: "medium",
        riesgo: "medio",
        kyc_required: false,
        requiere_kyc: false,
        min_deposit_usd: 10,
        min_deposito_usd: 10,
        networks: ["Ethereum"],
        redes: ["Ethereum"],
        url: "https://app.saturn.credit",
        note_en: "Backed by STRC (MicroStrategy preferred stock). 11.5%+ base APY. $45M TVL at launch. Non-US users only.",
        nota_latam: "Respaldado por STRC (acciones preferentes de MicroStrategy). 11.5%+ APY. Solo usuarios fuera de EE.UU.",
        catalyst: "Launched April 8. 7x points for USDC→USDat swaps. Airdrop potential."
      },
      {
        protocol: "Aave V4 (Ethereum/Base)",
        protocolo: "Aave V4 (Ethereum/Base)",
        asset: "USDC",
        activo: "USDC",
        apy_min: 4.0, apy_max: 6.0,
        risk: "low",
        riesgo: "bajo",
        kyc_required: false,
        requiere_kyc: false,
        min_deposit_usd: 1,
        min_deposito_usd: 1,
        networks: ["Ethereum", "Base", "Arbitrum"],
        redes: ["Ethereum", "Base", "Arbitrum"],
        url: "https://app.aave.com",
        note_en: "V4 launched March 30. Hub-and-spoke architecture. LlamaRisk now sole risk manager after Chaos Labs exit.",
        nota_latam: "V4 lanzado 30 marzo. LlamaRisk ahora gestor de riesgo tras salida de Chaos Labs.",
        catalyst: "Aave Pro institutional interface launched. $7.4M net deposits since V4 launch."
      },
      {
        protocol: "Sky / sUSDS",
        protocolo: "Sky / sUSDS",
        asset: "USDS",
        activo: "USDS",
        apy_min: 4.5, apy_max: 6.0,
        risk: "low-medium",
        riesgo: "bajo-medio",
        kyc_required: false,
        requiere_kyc: false,
        min_deposit_usd: 1,
        min_deposito_usd: 1,
        networks: ["Ethereum", "Base"],
        redes: ["Ethereum", "Base"],
        url: "https://sky.money",
        note_en: "sUSDS supply at $6.9B — nearly double its closest competitor. Strong inflows this week +$593.9M.",
        nota_latam: "sUSDS con $6.9B en oferta — casi el doble del competidor más cercano. Entradas esta semana +$593.9M.",
        catalyst: "Largest weekly inflow in weeks. Yield adjusted upward responding to market volatility."
      },
      {
        protocol: "Pendle Finance",
        protocolo: "Pendle Finance",
        asset: "USDC/PT tokens",
        activo: "USDC/PT tokens",
        apy_min: 8.0, apy_max: 15.0,
        risk: "medium",
        riesgo: "medio",
        kyc_required: false,
        requiere_kyc: false,
        min_deposit_usd: 10,
        min_deposito_usd: 10,
        networks: ["Ethereum", "Arbitrum", "Base", "Solana"],
        redes: ["Ethereum", "Arbitrum", "Base", "Solana"],
        url: "https://app.pendle.finance",
        note_en: "Expanding to Solana. Limit Order Incentives live: up to 100% APR. AI agents already operate here via MCP.",
        nota_latam: "Expandiendo a Solana. Limit Order Incentives activos: hasta 100% APR. Agentes de IA ya operan via MCP.",
        catalyst: "Solana expansion + 100% APR limit order incentives live now."
      },
      {
        protocol: "USDD (Tron/Morpho)",
        protocolo: "USDD (Tron/Morpho)",
        asset: "USDD",
        activo: "USDD",
        apy_min: 8.0, apy_max: 15.0,
        risk: "medium",
        riesgo: "medio",
        kyc_required: false,
        requiere_kyc: false,
        min_deposit_usd: 10,
        min_deposito_usd: 10,
        networks: ["Tron", "Ethereum"],
        redes: ["Tron", "Ethereum"],
        url: "https://usdd.io",
        note_en: "15%+ stablecoin looping APY on Morpho. 8%+ on Binance and Gate.io. Supply reached $1B.",
        nota_latam: "15%+ APY looping en Morpho. 8%+ en Binance y Gate.io. Oferta llegó a $1B.",
        catalyst: "Supply hit $1B milestone. Morpho collateral integration driving demand."
      },
      {
        protocol: "Origin OUSD (Beefy/Curve)",
        protocolo: "Origin OUSD (Beefy/Curve)",
        asset: "OUSD",
        activo: "OUSD",
        apy_min: 12.0, apy_max: 15.6,
        risk: "medium",
        riesgo: "medio",
        kyc_required: false,
        requiere_kyc: false,
        min_deposit_usd: 10,
        min_deposito_usd: 10,
        networks: ["Ethereum"],
        redes: ["Ethereum"],
        url: "https://beefy.com",
        note_en: "Up to 15.6% APY via Beefy/Curve. Cross-chain zaps: deposit ETH, USDC or 100+ assets directly.",
        nota_latam: "Hasta 15.6% APY via Beefy/Curve. Zaps cross-chain: deposita ETH, USDC o 100+ activos directamente.",
        catalyst: "New cross-chain zaps launched. Deposit any asset, earn 15.6% APY."
      }
    ]
  };
}

async function obtenerYields() {
  const data = DUNE_SIM_KEY
    ? await obtenerYieldsDuneSim()
    : obtenerYieldsCurados();

  const yields = data.yields || [];

  const summary_en = `${yields.length} protocols available. APY between ${Math.min(...yields.map(y => y.apy_min))}% and ${Math.max(...yields.map(y => y.apy_max))}%. No KYC required.`;
  const resumen_es = `${yields.length} protocolos disponibles desde LATAM. APY entre ${Math.min(...yields.map(y => y.apy_min))}% y ${Math.max(...yields.map(y => y.apy_max))}%. Sin KYC.`;

  return {
    exito: true,
    success: true,
    data: {
      ...data,
      yields
    },
    best_options: {
      highest_apy: [...yields].sort((a, b) => b.apy_max - a.apy_max)[0],
      safest: yields.find(y => y.risk === "low"),
      recommended_latam: yields.find(y => y.note_en && y.note_en.includes("LATAM"))
    },
    mejor_opcion: {
      mayor_apy: [...yields].sort((a, b) => b.apy_max - a.apy_max)[0],
      mas_seguro: yields.find(y => y.riesgo === "bajo"),
      recomendado_latam: yields.find(y => y.nota_latam && y.nota_latam.includes("Ecuador"))
    },
    summary: summary_en,
    resumen: resumen_es
  };
}

module.exports = { obtenerYields };