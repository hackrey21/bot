import express from 'express';
import axios from 'axios';
import cors from 'cors';
import https from 'https';

const app = express();

// --- CONFIGURACIÓN ---
const API_IA_URL = "https://trak-smart.trareysa.com:8093/api/chatbot/ask";
const API_TOKEN = "APIKEY_EMPRESA_SOFTGATE_001";

// Middleware
app.use(express.json());
app.use(cors());

// Agente para ignorar errores de certificado
const httpsAgent = new https.Agent({ 
    rejectUnauthorized: false,
    keepAlive: true 
});

// --- RUTA ACTUALIZADA PARA VERCEL ---
// Agregamos /api/ antes de ask para que coincida con la carpeta
app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "La pregunta es obligatoria." });
    }

    try {
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
                timeout: 45000 
            }
        );

        const dataIA = response.data?.data;
        const textoRespuesta = dataIA?.outputText || "La IA no devolvió texto de respuesta.";

        res.json({ 
            success: true,
            answer: textoRespuesta
        });

    } catch (error) {
        // Usamos una versión simple del manejo de errores para el ejemplo
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// --- IMPORTANTE: ESTO REEMPLAZA AL APP.LISTEN ---
export default app;