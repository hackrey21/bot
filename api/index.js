import express from 'express';
import axios from 'axios';
import cors from 'cors';
import https from 'https';

const app = express();

// --- CONFIGURACIÓN DE CORS MANUAL Y SEGURA ---
app.use((req, res, next) => {
    // Permitimos explícitamente tu dominio o cualquier origen (*)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, token, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // RESPUESTA INMEDIATA AL PREFLIGHT (OPTIONS)
    // Esto es lo que está fallando en tu consola
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// --- VARIABLES ---
const API_IA_URL = "https://trak-smart.trareysa.com:8093/api/chatbot/ask";
const API_TOKEN = "APIKEY_EMPRESA_SOFTGATE_001";

const httpsAgent = new https.Agent({ 
    rejectUnauthorized: false,
    keepAlive: true 
});

// --- RUTA POST ---
app.post('/ask', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Pregunta obligatoria" });

    try {
        const response = await axios.post(API_IA_URL, {
            message: question,
            vista: "CFDI",
            controladorOModulo: "SoporteCfdiController"
        }, {
            headers: { 
                "token": API_TOKEN,
                "Content-Type": "application/json"
            },
            httpsAgent: httpsAgent,
            timeout: 45000
        });

        res.json({ 
            success: true, 
            answer: response.data?.data?.outputText || "Sin respuesta" 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default app;

