const express = require("express");
const { obtenerYields } = require("./data/yields");
const { analizarRiesgo, obtenerResumenRiesgo } = require("./data/risks");
const { obtenerAcciones } = require("./data/stocks");

require("dotenv").config();

// Importar mppx middleware Express oficial
let Mppx, tempo, payment;
try {
  const mppxExpress = require("mppx/express");
  const mppxServer = require("mppx/server");
  Mppx = mppxExpress.Mppx;
  tempo = mppxServer.tempo;
  payment = mppxExpress.payment;
} catch(e) {
  console.log("mppx no disponible, usando x402 manual");
}

const app = express();
app.use(express.json());

// Configurar mppx con tempo
let mppx = null;
if (Mppx && tempo) {
  try {
    const { privateKeyToAccount } = require("viem/accounts");
    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    mppx = Mppx.create({
      secretKey: process.env.MPP_SECRET_KEY,
      methods: [tempo({
        currency: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        recipient: account.address,
        account: account,
      })],
    });
    console.log("mppx inicializado con tempo");
  } catch(e) {
    console.log("Error iniciando mppx:", e.message);
  }
}

const crypto = require("crypto");

function cobrar(monto) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) return next();

    const crypto = require("crypto");
    const realm = "defi-latam-mpp-production.up.railway.app";

    const requestDataTempo = Buffer.from(JSON.stringify({
      amount: String(Math.round(monto * 1000000)),
      currency: "0x20c000000000000000000000b9537d11c60e8b50",
      recipient: process.env.RECIPIENT_ADDRESS,
      network: "eip155:1620"
    })).toString("base64");

    const requestDataBase = Buffer.from(JSON.stringify({
      amount: String(Math.round(monto * 1000000)),
      currency: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      recipient: process.env.RECIPIENT_ADDRESS,
      network: "eip155:8453"
    })).toString("base64");

    res.set("WWW-Authenticate",
      `Payment id="${crypto.randomUUID()}", realm="${realm}", method="tempo", intent="charge", request="${requestDataTempo}", ` +
      `Payment id="${crypto.randomUUID()}", realm="${realm}", method="x402", intent="charge", request="${requestDataBase}"`
    );

    res.status(402).json({
      version: "0.1",
      error: "Payment Required",
      accepts: [
        {
          scheme: "exact",
          network: "eip155:1620",
          maxAmountRequired: String(Math.round(monto * 1000000)),
          resource: `https://${realm}${req.path}`,
          description: `DeFi LATAM Intelligence — ${req.path}`,
          mimeType: "application/json",
          payTo: process.env.RECIPIENT_ADDRESS,
          maxTimeoutSeconds: 300,
          asset: "0x20c000000000000000000000b9537d11c60e8b50",
          extra: { name: "PathUSD", version: "1" }
        },
        {
          scheme: "exact",
          network: "eip155:8453",
          maxAmountRequired: String(Math.round(monto * 1000000)),
          resource: `https://${realm}${req.path}`,
          description: `DeFi LATAM Intelligence — ${req.path}`,
          mimeType: "application/json",
          payTo: process.env.RECIPIENT_ADDRESS,
          maxTimeoutSeconds: 300,
          asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
          extra: { name: "USDC", version: "1" }
        }
      ]
    });
  };
}

// Discovery para Agentic.Market
app.get('/.well-known/x402', (req, res) => {
  res.json({
    version: 1,
    origin: "https://defi-latam-mpp-production.up.railway.app",
    resources: [
      { path: "/yields", price: "$0.02", description: "DeFi yields in Spanish" },
      { path: "/riesgo", price: "$0.05", description: "DeFi risk analysis in Spanish" },
      { path: "/acciones", price: "$0.03", description: "Tokenized stocks in Spanish" },
      { path: "/resumen", price: "$0.10", description: "Weekly DeFi summary in Spanish" }
    ]
  });
});

// OpenAPI spec para agentcash discovery
app.get('/openapi.json', (req, res) => {
  res.json({
    openapi: "3.1.0",
    info: {
      title: "DeFi LATAM Intelligence API",
      description: "First x402-native DeFi data API in Spanish for Latin America. Built from Manta, Ecuador.",
      version: "3.0.0"
    },
    servers: [
      { url: "https://defi-latam-mpp-production.up.railway.app" }
    ],
    paths: {
      "/yields": {
        get: {
          summary: "DeFi yields in Spanish",
          description: "Returns top DeFi yield opportunities for LATAM investors. Costs $0.02 USDC via x402.",
          "x-price": "0.02",
          "x-currency": "USDC"
        }
      },
      "/riesgo": {
        get: {
          summary: "DeFi risk analysis in Spanish",
          description: "Risk alerts and protocol safety status. Costs $0.05 USDC via x402.",
          "x-price": "0.05",
          "x-currency": "USDC"
        }
      },
      "/acciones": {
        get: {
          summary: "Tokenized stocks in Spanish",
          description: "Tokenized stocks available without broker. Costs $0.03 USDC via x402.",
          "x-price": "0.03",
          "x-currency": "USDC"
        }
      },
      "/resumen": {
        get: {
          summary: "Weekly DeFi summary in Spanish",
          description: "Weekly DeFi market summary for LATAM. Costs $0.10 USDC via x402.",
          "x-price": "0.10",
          "x-currency": "USDC"
        }
      }
    }
  });
});

// Info del servicio (gratis)
app.get("/", (req, res) => {
  res.json({
    servicio: "DeFi LATAM Intelligence API",
    version: "3.0.0",
    origen: "Manta, Ecuador 🇪🇨",
    protocolo: mppx ? "MPP/Tempo + x402 fallback" : "x402/Base",
    endpoints: [
      { ruta: "/yields",   precio_usdc: 0.02 },
      { ruta: "/riesgo",   precio_usdc: 0.05 },
      { ruta: "/acciones", precio_usdc: 0.03 },
      { ruta: "/resumen",  precio_usdc: 0.10 }
    ]
  });
});

app.get("/yields", cobrar(0.02), async (req, res) => {
  const resultado = await obtenerYields();
  res.json({ ...resultado, precio_cobrado_usd: 0.02 });
});

app.get("/riesgo", cobrar(0.05), async (req, res) => {
  const { protocolo } = req.query;
  const resultado = protocolo
    ? await analizarRiesgo(protocolo)
    : await obtenerResumenRiesgo();
  res.json({ exito: true, data: resultado, precio_cobrado_usd: 0.05 });
});

app.get("/acciones", cobrar(0.03), async (req, res) => {
  const { filtro } = req.query;
  const resultado = await obtenerAcciones(filtro);
  res.json({ ...resultado, precio_cobrado_usd: 0.03 });
});

app.get("/resumen", cobrar(0.10), async (req, res) => {
  const [yields, riesgos, acciones] = await Promise.all([
    obtenerYields(), obtenerResumenRiesgo(), obtenerAcciones()
  ]);
  res.json({
    exito: true,
    fecha: new Date().toISOString(),
    yields: yields.data,
    riesgos: riesgos.data.eventos_recientes,
    acciones_disponibles: acciones.data.acciones.length,
    precio_cobrado_usd: 0.10
  });
});

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`DeFi LATAM API v3.0 — Puerto ${PUERTO}`);
  console.log(`Modo: ${mppx ? "MPP/Tempo activo" : "x402/Base fallback"}`);
});

module.exports = app;