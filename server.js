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

// Discovery endpoint para x402scan
app.get("/.well-known/x402", (req, res) => {
  res.json({
    version: 1,
    resources: [
      "GET /yields",
      "GET /riesgo",
      "GET /acciones",
      "GET /resumen"
    ]
  });
});

app.get("/openapi.json", (req, res) => {
  res.json({
    openapi: "3.1.0",
    info: {
      title: "DeFi LATAM Intelligence API",
      version: "3.0.0",
      "x-guidance": "API de datos DeFi en español para LATAM. Construida en Manta, Ecuador. Paga con USDC en Base para acceder a yields, riesgo, acciones tokenizadas y resumen semanal del mercado DeFi."
    },
    paths: {
      "/yields": {
        get: {
          summary: "APY actuales de protocolos DeFi accesibles desde LATAM",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    filtro: { type: "string", description: "Filtrar por protocolo (opcional)" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Datos de yields exitosos" },
            "402": { description: "Payment Required" }
          },
          "x-payment-info": {
            price: { mode: "fixed", currency: "USD", amount: "0.02" },
            protocols: [{ "x402": {} }]
          }
        }
      },
      "/riesgo": {
        get: {
          summary: "Análisis de riesgo de protocolos DeFi en tiempo real",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    protocolo: { type: "string", description: "Protocolo específico a analizar (opcional)" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Análisis de riesgo exitoso" },
            "402": { description: "Payment Required" }
          },
          "x-payment-info": {
            price: { mode: "fixed", currency: "USD", amount: "0.05" },
            protocols: [{ "x402": {} }]
          }
        }
      },
      "/acciones": {
        get: {
          summary: "Acciones tokenizadas disponibles desde LATAM sin broker",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    filtro: { type: "string", description: "Filtrar por ticker o emisor (opcional)" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Lista de acciones exitosa" },
            "402": { description: "Payment Required" }
          },
          "x-payment-info": {
            price: { mode: "fixed", currency: "USD", amount: "0.03" },
            protocols: [{ "x402": {} }]
          }
        }
      },
      "/resumen": {
        get: {
          summary: "Resumen semanal completo del mercado DeFi para LATAM",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    semana: { type: "string", description: "Semana específica en formato YYYY-MM-DD (opcional)" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Resumen exitoso" },
            "402": { description: "Payment Required" }
          },
          "x-payment-info": {
            price: { mode: "fixed", currency: "USD", amount: "0.10" },
            protocols: [{ "x402": {} }]
          }
        }
      }
    }
  });
});

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

    const challengeId = crypto.randomUUID();
    const realm = "defi-latam-mpp-production.up.railway.app";
    
    const requestDataBase = Buffer.from(JSON.stringify({
      amount: String(Math.round(monto * 1000000)),
      currency: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      recipient: process.env.RECIPIENT_ADDRESS,
      network: "eip155:8453"
    })).toString("base64");

    const requestDataTempo = Buffer.from(JSON.stringify({
      amount: String(Math.round(monto * 1000000)),
      currency: "0x20c000000000000000000000b9537d11c60e8b50",
      recipient: process.env.RECIPIENT_ADDRESS,
      network: "eip155:1620"
    })).toString("base64");

    // Soporta ambos: Base USDC y Tempo PathUSD
    res.set("WWW-Authenticate", 
      `Payment id="${challengeId}", realm="${realm}", method="x402", intent="charge", request="${requestDataBase}", ` +
      `Payment id="${crypto.randomUUID()}", realm="${realm}", method="tempo", intent="charge", request="${requestDataTempo}"`
    );
        
    res.status(402).json({
      version: "0.1",
      error: "Payment Required",
      accepts: [
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
        },
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
        }
      ]
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

const path = require("path");

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`DeFi LATAM API v3.0 — Puerto ${PUERTO}`);
  console.log(`Modo: ${mppx ? "MPP/Tempo activo" : "x402/Base fallback"}`);
});

module.exports = app;
