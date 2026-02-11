import express from 'express';
import axios from 'axios';
import cors from 'cors';
import https from 'https';

const app = express();

// --- 1. CONFIGURACIÓN DE CORS ---
// Esto permite que tu sitio en HostGator (trareysadoc.com) hable con Vercel
app.use(cors({
    origin: '*', // Permite peticiones desde cualquier origen
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'token', 'Accept'],
    credentials: true
}));

// Middleware para entender JSON
app.use(express.json());

// Responder automáticamente a las peticiones "preflight" (OPTIONS)
app.options('*', cors());

// --- 2. VARIABLES DE ENTORNO ---
const API_IA_URL = "https://trak-smart.trareysa.com:8093/api/chatbot/ask";
const API_TOKEN = "APIKEY_EMPRESA_SOFTGATE_001";

// Agente HTTPS para ignorar el certificado no confiable de la IA
const httpsAgent = new https.Agent({ 
    rejectUnauthorized: false,
    keepAlive: true 
});

// --- 3. RUTA DEL PUENTE ---
app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    // Validación básica
    if (!question) {
        return res.status(400).json({ 
            success: false, 
            error: "La pregunta es obligatoria." 
        });
    }

    try {
        // Petición a la API externa de Trareysa (Puerto 8093)
        const response = await axios.post(
            API_IA_URL,
            {
                message: question,
                vista: "CFDI",
                controladorOModulo: "SoporteCfdiController"
            },
            {
                headers: { 
                    "token": API_TOKEN,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                httpsAgent: httpsAgent,
                timeout: 45000 // 45 segundos de espera
            }
        );

        // Extraer la respuesta de la estructura de Trareysa
        const dataIA = response.data?.data;
        const textoRespuesta = dataIA?.outputText || "La IA no devolvió una respuesta válida.";

        // Responder al frontend (HostGator)
        res.json({ 
            success: true,
            answer: textoRespuesta,
            meta: {
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Error en el puente:", error.message);
        
        // Manejo detallado de errores para debug
        const status = error.response ? error.response.status : 500;
        const mensaje = error.response ? error.response.data : error.message;

        res.status(status).json({
            success: false,
            error: "Error al conectar con la IA de Trareysa",
            detalles: mensaje
        });
    }
});

// --- 4. EXPORTACIÓN PARA VERCEL ---
// IMPORTANTE: No usamos app.listen(). Vercel maneja el inicio.
export default app;
