const express = require("express");
const { paymentMiddleware, x402ResourceServer } = require("@x402/express");
const { ExactEvmScheme } = require("@x402/evm/exact/server");
const { HTTPFacilitatorClient } = require("@x402/core/server");
const { obtenerYields } = require("./data/yields");
const { analizarRiesgo, obtenerResumenRiesgo } = require("./data/risks");
const { obtenerAcciones } = require("./data/stocks");

require("dotenv").config();

const app = express();
app.use(express.json());

// Tu wallet en Base — donde recibes los pagos
const TU_WALLET = process.env.RECIPIENT_ADDRESS;

// Facilitador de Coinbase (mainnet Base)
const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://api.cdp.coinbase.com/platform/v2/x402"
});

const resourceServer = new x402ResourceServer(facilitatorClient)
  .register("eip155:8453", new ExactEvmScheme());

// Middleware de pago oficial x402
app.use(
  paymentMiddleware(
    {
      "GET /yields": {
        accepts: [{
          scheme: "exact",
          price: "$0.02",
          network: "eip155:8453",
          payTo: TU_WALLET,
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
          payTo: TU_WALLET,
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
          payTo: TU_WALLET,
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
          payTo: TU_WALLET,
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

// Info del servicio (gratis)
app.get("/", (req, res) => {
  res.json({
    servicio: "DeFi LATAM Intelligence API",
    version: "4.0.0",
    origen: "Manta, Ecuador 🇪🇨",
    protocolo: "x402 oficial (Coinbase SDK) en Base Mainnet",
    wallet: TU_WALLET,
    endpoints: [
      { ruta: "/yields",   precio: "$0.02", descripcion: "APYs en tiempo real" },
      { ruta: "/riesgo",   precio: "$0.05", descripcion: "Análisis de riesgo" },
      { ruta: "/acciones", precio: "$0.03", descripcion: "Acciones tokenizadas" },
      { ruta: "/resumen",  precio: "$0.10", descripcion: "Resumen semanal" }
    ],
    descubrimiento: "Registrado en x402 Bazaar — discoverable por agentes de IA"
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
    riesgos: riesgos.data.eventos_recientes,
    acciones_disponibles: acciones.data.acciones.length,
    precio_cobrado_usd: 0.10
  });
});

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`DeFi LATAM API v4.0 — Puerto ${PUERTO}`);
  console.log(`Wallet: ${TU_WALLET}`);
  console.log(`Red: Base Mainnet (eip155:8453)`);
  console.log(`Discoverable en x402 Bazaar: SI`);
});

module.exports = app;