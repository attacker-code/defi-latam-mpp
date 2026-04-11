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

    // Construir request en base64 (formato PaymentRequest)
    const requestData = {
      amount: String(Math.round(monto * 1000000)),
      currency: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      recipient: process.env.RECIPIENT_ADDRESS,
      network: "base"
    };
    const requestB64 = Buffer.from(JSON.stringify(requestData)).toString("base64");
    const challengeId = crypto.randomUUID();
    const realm = "defi-latam-mpp-production.up.railway.app";

    // Formato exacto que mppx espera
    const wwwAuth = `Payment id="${challengeId}", realm="${realm}", method="tempo", intent="charge", request="${requestB64}"`;

    res.set("WWW-Authenticate", wwwAuth);
    res.status(402).json({
      version: "0.1",
      error: "Payment Required",
      accepts: [{
        scheme: "exact",
        network: "base",
        maxAmountRequired: String(Math.round(monto * 1000000)),
        resource: `https://${realm}${req.path}`,
        description: `DeFi LATAM Intelligence — ${req.path}`,
        mimeType: "application/json",
        payTo: process.env.RECIPIENT_ADDRESS,
        maxTimeoutSeconds: 300,
        asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        extra: { name: "USDC", version: "1" }
      }]
    });
  };
}

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