const express = require("express");
const { Mppx, tempo } = require("mppx/server");
const { privateKeyToAccount } = require("viem/accounts");
const { obtenerYields } = require("./data/yields");
const { analizarRiesgo, obtenerResumenRiesgo } = require("./data/risks");
const { obtenerAcciones } = require("./data/stocks");

require("dotenv").config();

const app = express();
app.use(express.json());

// Cuenta de firma para MPP
const account = privateKeyToAccount(process.env.PRIVATE_KEY);

// Configuración MPP con cuenta completa
const mppx = Mppx.create({
  methods: [tempo({
    currency: '0x20c0000000000000000000000000000000000000',
    recipient: account.address,
    account: account,
  })],
});

// Helper de cobro para Express
function cobrar(monto) {
  return async (req, res, next) => {
    try {
      const result = await Mppx.toNodeListener(
        mppx.charge({ amount: String(monto) })
      )(req, res);
      if (result && result.status === 402) return;
      next();
    } catch (e) {
      console.error("Error MPP:", e.message);
      next();
    }
  };
}

// Info del servicio (gratis)
app.get("/", (req, res) => {
  res.json({
    servicio: "DeFi LATAM Intelligence API",
    descripcion: "Datos de mercados DeFi para LATAM en español.",
    version: "1.0.0",
    origen: "Manta, Ecuador 🇪🇨",
    wallet: account.address,
    endpoints: [
      { ruta: "/yields",   precio_usd: 0.02 },
      { ruta: "/riesgo",   precio_usd: 0.05 },
      { ruta: "/acciones", precio_usd: 0.03 },
      { ruta: "/resumen",  precio_usd: 0.10 },
    ]
  });
});

// Endpoints con cobro MPP
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
    obtenerYields(),
    obtenerResumenRiesgo(),
    obtenerAcciones()
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
  console.log(`DeFi LATAM API corriendo en puerto ${PUERTO}`);
  console.log(`Wallet: ${account.address}`);
});

module.exports = app;