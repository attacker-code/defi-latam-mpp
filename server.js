// DeFi LATAM Intelligence API
// Servicio MPP para agentes de IA
// Construido en Manta, Ecuador 🇪🇨
// 
// PRECIOS:
// /yields     → $0.02 por query
// /riesgo     → $0.05 por query
// /acciones   → $0.03 por query
// /resumen    → $0.10 por query (premium)

const express = require("express");
const { obtenerYields } = require("./data/yields");
const { analizarRiesgo, obtenerResumenRiesgo } = require("./data/risks");
const { obtenerAcciones } = require("./data/stocks");

const app = express();
app.use(express.json());

const PRECIO_POR_ENDPOINT = {
  "/yields": 0.02,
  "/riesgo": 0.05,
  "/acciones": 0.03,
  "/resumen": 0.10
};

// ============================
// MIDDLEWARE DE LOGGING
// ============================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const precio = PRECIO_POR_ENDPOINT[req.path] || 0;
  console.log(`[${timestamp}] ${req.method} ${req.path} | Precio: $${precio}`);
  next();
});

// ============================
// ENDPOINT RAÍZ — Info del servicio
// ============================
app.get("/", (req, res) => {
  res.json({
    servicio: "DeFi LATAM Intelligence API",
    descripcion: "Datos de mercados DeFi para LATAM en español. Optimizado para agentes de IA.",
    version: "1.0.0",
    origen: "Manta, Ecuador 🇪🇨",
    endpoints: [
      {
        ruta: "/yields",
        descripcion: "APY actuales de protocolos DeFi accesibles desde LATAM",
        precio_usd: 0.02,
        metodo: "GET"
      },
      {
        ruta: "/riesgo",
        descripcion: "Análisis de riesgo de protocolo específico",
        precio_usd: 0.05,
        metodo: "GET",
        parametros: "?protocolo=morpho"
      },
      {
        ruta: "/acciones",
        descripcion: "Acciones tokenizadas disponibles desde LATAM sin broker",
        precio_usd: 0.03,
        metodo: "GET",
        parametros: "?filtro=nvidia (opcional)"
      },
      {
        ruta: "/resumen",
        descripcion: "Resumen semanal completo del mercado DeFi",
        precio_usd: 0.10,
        metodo: "GET"
      }
    ],
    mpp_info: {
      protocolo: "Machine Payments Protocol (MPP)",
      chain: "Tempo Mainnet",
      wallet: "Configura tu wallet en .env",
      documentacion: "https://docs.tempo.xyz/mpp"
    },
    contacto: "DeFi LATAM Intelligence — Ecuador"
  });
});

// ============================
// ENDPOINT 1: YIELDS
// $0.02 por query
// ============================
app.get("/yields", async (req, res) => {
  try {
    // NOTA: Aquí irá el middleware de pago MPP
    // Por ahora retorna datos directamente para testing
    
    const resultado = await obtenerYields();
    
    res.json({
      ...resultado,
      precio_cobrado_usd: PRECIO_POR_ENDPOINT["/yields"],
      actualizacion: new Date().toISOString(),
      nota: "Datos actualizados semanalmente desde boletines institucionales"
    });
    
  } catch (error) {
    res.status(500).json({
      exito: false,
      error: "Error obteniendo yields",
      detalle: error.message
    });
  }
});

// ============================
// ENDPOINT 2: ANÁLISIS DE RIESGO
// $0.05 por query
// ============================
app.get("/riesgo", async (req, res) => {
  try {
    const { protocolo } = req.query;
    
    if (!protocolo) {
      // Sin parámetro: devuelve resumen general
      const resultado = await obtenerResumenRiesgo();
      return res.json({
        ...resultado,
        precio_cobrado_usd: PRECIO_POR_ENDPOINT["/riesgo"],
        uso: "Añade ?protocolo=morpho para análisis específico"
      });
    }
    
    const resultado = await analizarRiesgo(protocolo);
    
    res.json({
      exito: true,
      data: resultado,
      precio_cobrado_usd: PRECIO_POR_ENDPOINT["/riesgo"],
      actualizacion: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      exito: false,
      error: "Error analizando riesgo",
      detalle: error.message
    });
  }
});

// ============================
// ENDPOINT 3: ACCIONES TOKENIZADAS
// $0.03 por query
// ============================
app.get("/acciones", async (req, res) => {
  try {
    const { filtro } = req.query;
    const resultado = await obtenerAcciones(filtro);
    
    res.json({
      ...resultado,
      precio_cobrado_usd: PRECIO_POR_ENDPOINT["/acciones"],
      actualizacion: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      exito: false,
      error: "Error obteniendo acciones tokenizadas",
      detalle: error.message
    });
  }
});

// ============================
// ENDPOINT 4: RESUMEN SEMANAL (PREMIUM)
// $0.10 por query
// ============================
app.get("/resumen", async (req, res) => {
  try {
    // Combina todos los datos para un resumen ejecutivo
    const [yields, riesgos, acciones] = await Promise.all([
      obtenerYields(),
      obtenerResumenRiesgo(),
      obtenerAcciones()
    ]);
    
    const resumen = {
      fecha: new Date().toISOString(),
      semana: obtenerSemanaActual(),
      mercado: {
        btc_en_exchanges: "2.71M BTC (mínimo 12 meses) — sell-side thin",
        stablecoin_flujos: "USDS lidera (+$330M), USYC +$166M",
        tendencia: "Rotación hacia yield-bearing stablecoins",
        riesgo_macro: "Guerra en Medio Oriente. Petróleo Brent $106+"
      },
      yields: yields.data,
      riesgos_activos: riesgos.data.eventos_recientes,
      acciones_tokenizadas: {
        total_disponibles: acciones.data.acciones.length,
        nuevos_esta_semana: 60,
        top_volumen: acciones.data.acciones[0]
      },
      eventos_clave: [
        "Aave V4 aprobado por DAO (25 marzo 2026)",
        "Resolv USR exploit $25M (23 marzo 2026)",
        "Franklin Templeton + Ondo: 60+ ETFs tokenizados (27 marzo 2026)",
        "Bitcoin como garantía hipotecaria en Fannie Mae (27 marzo 2026)",
        "DTCC tokenizando $150 trillones en valores (27 marzo 2026)"
      ],
      oportunidades_latam: [
        "Morpho Base: 5-8% APY en USDC, sin KYC, fees $0.01",
        "Nado NLP Vault: 20%+ APY, 4x puntos esta semana (airdrop potencial)",
        "Ondo Finance: acciones tokenizadas sin broker americano",
        "Tempo MPP: early mover en pagos de agentes (9 días de vida)"
      ]
    };
    
    res.json({
      exito: true,
      data: resumen,
      precio_cobrado_usd: PRECIO_POR_ENDPOINT["/resumen"],
      nota: "Resumen ejecutivo semanal basado en boletines institucionales"
    });
    
  } catch (error) {
    res.status(500).json({
      exito: false,
      error: "Error generando resumen",
      detalle: error.message
    });
  }
});

// ============================
// FUNCIÓN AUXILIAR
// ============================
function obtenerSemanaActual() {
  const ahora = new Date();
  const inicio = new Date(ahora.getFullYear(), 0, 1);
  const semana = Math.ceil(((ahora - inicio) / 86400000 + inicio.getDay() + 1) / 7);
  return `Semana ${semana} de ${ahora.getFullYear()}`;
}

// ============================
// INICIAR SERVIDOR
// ============================
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`
╔════════════════════════════════════════╗
║   DeFi LATAM Intelligence API          ║
║   Corriendo en puerto ${PUERTO}            ║
║   Origen: Manta, Ecuador 🇪🇨            ║
╠════════════════════════════════════════╣
║ Endpoints disponibles:                 ║
║   GET /          → Info del servicio   ║
║   GET /yields    → APYs ($0.02)        ║
║   GET /riesgo    → Análisis ($0.05)    ║
║   GET /acciones  → Stocks ($0.03)      ║
║   GET /resumen   → Premium ($0.10)     ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;