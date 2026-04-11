const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { paymentMiddleware, x402ResourceServer } = require("@x402/express");
const { ExactEvmScheme } = require("@x402/evm/exact/server");
const { HTTPFacilitatorClient } = require("@x402/core/server");
const { obtenerYields } = require("./data/yields");
const { analizarRiesgo, obtenerResumenRiesgo } = require("./data/risks");
const { obtenerAcciones } = require("./data/stocks");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const WALLET = process.env.RECIPIENT_ADDRESS;

// Satoshi Facilitator — open source, sin API key, Base mainnet
const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://facilitator.bitcoinsapi.com"
});

const resourceServer = new x402ResourceServer(facilitatorClient)
  .register("eip155:8453", new ExactEvmScheme());

// Middleware x402 oficial
app.use(
  paymentMiddleware(
    {
      "GET /yields": {
        accepts: [{
          scheme: "exact",
          price: "$0.02",
          network: "eip155:8453",
          payTo: WALLET,
        }],
        description: "APY actuales de protocolos DeFi accesibles desde LATAM",
        mimeType: "application/json",
        extensions: {
          bazaar: {
            discoverable: true,
            category: "defi",
            tags: ["yields", "latam", "español", "morpho", "aave"],
          }
        }
      },
      "GET /riesgo": {
        accepts: [{
          scheme: "exact",
          price: "$0.05",
          network: "eip155:8453",
          payTo: WALLET,
        }],
        description: "Análisis de riesgo de protocolos DeFi en tiempo real",
        mimeType: "application/json",
        extensions: {
          bazaar: {
            discoverable: true,
            category: "defi",
            tags: ["riesgo", "seguridad", "latam"],
          }
        }
      },
      "GET /acciones": {
        accepts: [{
          scheme: "exact",
          price: "$0.03",
          network: "eip155:8453",
          payTo: WALLET,
        }],
        description: "Acciones tokenizadas disponibles desde LATAM sin broker",
        mimeType: "application/json",
        extensions: {
          bazaar: {
            discoverable: true,
            category: "rwa",
            tags: ["acciones", "tokenizadas", "latam", "ondo"],
          }
        }
      },
      "GET /resumen": {
        accepts: [{
          scheme: "exact",
          price: "$0.10",
          network: "eip155:8453",
          payTo: WALLET,
        }],
        description: "Resumen semanal completo del mercado DeFi para LATAM",
        mimeType: "application/json",
        extensions: {
          bazaar: {
            discoverable: true,
            category: "defi",
            tags: ["resumen", "mercado", "latam", "español"],
          }
        }
      },
    },
    resourceServer
  )
);

// Discovery endpoints
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
      version: "4.0.0",
      "x-guidance": "API de datos DeFi en español para LATAM. Construida en Manta, Ecuador. Paga con USDC en Base para acceder a yields, riesgo, acciones tokenizadas y resumen semanal."
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
                    protocolo: { type: "string", description: "Protocolo a analizar (opcional)" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Análisis exitoso" },
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
                    filtro: { type: "string", description: "Filtrar por ticker (opcional)" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Lista exitosa" },
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
                    semana: { type: "string", description: "Semana específica (opcional)" }
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

// Info del servicio (gratis)
app.get("/", (req, res) => {
  res.json({
    servicio: "DeFi LATAM Intelligence API",
    version: "4.0.0",
    origen: "Manta, Ecuador 🇪🇨",
    protocolo: "x402 v2 oficial — Base Mainnet",
    facilitador: "Satoshi Facilitator (open source)",
    wallet: WALLET,
    endpoints: [
      { ruta: "/yields",   precio: "$0.02" },
      { ruta: "/riesgo",   precio: "$0.05" },
      { ruta: "/acciones", precio: "$0.03" },
      { ruta: "/resumen",  precio: "$0.10" }
    ]
  });
});

app.get("/yields", async (req, res) => {
  const resultado = await obtenerYields();
  res.json({ ...resultado, precio_cobrado_usd: 0.02 });
});

app.get("/riesgo", async (req, res) => {
  const { protocolo } = req.query;
  const resultado = protocolo
    ? await analizarRiesgo(protocolo)
    : await obtenerResumenRiesgo();
  res.json({ exito: true, data: resultado, precio_cobrado_usd: 0.05 });
});

app.get("/acciones", async (req, res) => {
  const { filtro } = req.query;
  const resultado = await obtenerAcciones(filtro);
  res.json({ ...resultado, precio_cobrado_usd: 0.03 });
});

app.get("/resumen", async (req, res) => {
  const [yields, riesgos, acciones] = await Promise.all([
    obtenerYields(), obtenerResumenRiesgo(), obtenerAcciones()
  ]);
  res.json({
    exito: true,
    fecha: new Date().toISOString(),
    yields: yields.data,
    riesgos: riesgos.data?.eventos_recientes,
    acciones_disponibles: acciones.data?.acciones?.length,
    precio_cobrado_usd: 0.10
  });
});

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`DeFi LATAM API v4.0 — Puerto ${PUERTO}`);
  console.log(`Wallet: ${WALLET}`);
  console.log(`Facilitador: Satoshi (open source)`);
});

module.exports = app;