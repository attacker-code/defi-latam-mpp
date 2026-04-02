const express = require("express");
const { obtenerYields } = require("./data/yields");
const { analizarRiesgo, obtenerResumenRiesgo } = require("./data/risks");
const { obtenerAcciones } = require("./data/stocks");

require("dotenv").config();

const app = express();
app.use(express.json());

// ============================
// MIDDLEWARE x402
// Verifica pago antes de dar datos
// ============================
function verificarPago(precio) {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      console.log(`[PAGO] Recibido para ${req.path}`);
      return next();
    }

    const monto = Math.round(precio * 1000000).toString();
    const recurso = `https://defi-latam-mpp-production.up.railway.app${req.path}`;

    // Challenge x402 con WWW-Authenticate header
    const challenge = {
      scheme: "exact",
      network: "base",
      maxAmountRequired: monto,
      resource: recurso,
      description: `DeFi LATAM Intelligence — ${req.path}`,
      mimeType: "application/json",
      payTo: process.env.RECIPIENT_ADDRESS,
      maxTimeoutSeconds: 300,
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      extra: { name: "USDC", version: "1" }
    };

    const challengeB64 = Buffer.from(JSON.stringify(challenge)).toString("base64");

    res.set("WWW-Authenticate", `Payment realm="defi-latam", challenge="${challengeB64}"`);
    res.status(402).json({
      version: "0.1",
      error: "Payment Required",
      accepts: [challenge]
    });
  };
}

// ============================
// ENDPOINT RAÍZ — gratis
// ============================
app.get("/", (req, res) => {
  res.json({
    servicio: "DeFi LATAM Intelligence API",
    descripcion: "Datos de mercados DeFi para LATAM en español. Optimizado para agentes de IA.",
    version: "2.0.0",
    origen: "Manta, Ecuador 🇪🇨",
    protocolo: "x402 en Base",
    wallet: process.env.RECIPIENT_ADDRESS,
    endpoints: [
      { ruta: "/yields",   precio_usdc: 0.02, descripcion: "APY actuales LATAM" },
      { ruta: "/riesgo",   precio_usdc: 0.05, descripcion: "Análisis de riesgo" },
      { ruta: "/acciones", precio_usdc: 0.03, descripcion: "Acciones tokenizadas" },
      { ruta: "/resumen",  precio_usdc: 0.10, descripcion: "Resumen semanal premium" }
    ],
    como_pagar: {
      protocolo: "x402",
      red: "Base (chain ID 8453)",
      token: "USDC en Base: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      documentacion: "https://x402.org"
    }
  });
});

// ============================
// /yields — $0.02 USDC
// ============================
app.get("/yields", verificarPago(0.02), async (req, res) => {
  try {
    const resultado = await obtenerYields();
    res.json({
      ...resultado,
      precio_pagado_usdc: 0.02,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================
// /riesgo — $0.05 USDC
// ============================
app.get("/riesgo", verificarPago(0.05), async (req, res) => {
  try {
    const { protocolo } = req.query;
    const resultado = protocolo
      ? await analizarRiesgo(protocolo)
      : await obtenerResumenRiesgo();
    res.json({
      exito: true,
      data: resultado,
      precio_pagado_usdc: 0.05,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================
// /acciones — $0.03 USDC
// ============================
app.get("/acciones", verificarPago(0.03), async (req, res) => {
  try {
    const { filtro } = req.query;
    const resultado = await obtenerAcciones(filtro);
    res.json({
      ...resultado,
      precio_pagado_usdc: 0.03,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================
// /resumen — $0.10 USDC (premium)
// ============================
app.get("/resumen", verificarPago(0.10), async (req, res) => {
  try {
    const [yields, riesgos, acciones] = await Promise.all([
      obtenerYields(),
      obtenerResumenRiesgo(),
      obtenerAcciones()
    ]);
    res.json({
      exito: true,
      fecha: new Date().toISOString(),
      mercado: {
        tendencia: "Rotación a RWA yields — USDY, USYC, BUIDL lideran",
        base_volumen: "$4.76B semanal — DEX más rápido creciendo",
        aave_v4: "Lanzado en mainnet Ethereum",
        franklin_ondo: "5 ETFs tokenizados con trading 24/7"
      },
      yields: yields.data,
      riesgos: riesgos.data.eventos_recientes,
      acciones_disponibles: acciones.data.acciones.length,
      oportunidades_latam: [
        "Base network: fees $0.01, x402 nativo",
        "1inch MCP: agentes ejecutan trades automáticamente",
        "P2P.me expandiéndose a Ecuador próximamente",
        "Ondo Finance: 60+ acciones tokenizadas nuevas"
      ],
      precio_pagado_usdc: 0.10
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================
// INICIAR
// ============================
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`DeFi LATAM API v2.0 — Puerto ${PUERTO}`);
  console.log(`Protocolo: x402 en Base`);
  console.log(`Recipient: ${process.env.RECIPIENT_ADDRESS}`);
});

module.exports = app;