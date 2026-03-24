import axios from 'axios';
import https from 'https';

const API_IA_URL = "https://softgateia-api.trareysa.com:8096/api/chatbot/ask";
const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
    // 1. CONFIGURACIÓN DE HEADERS (DEBEN IR AL PRINCIPIO)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://trareysadoc.com'); // Es más seguro que '*'
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, token');

    // 2. MANEJO DE PREFLIGHT (CRUCIAL)
    // Si el navegador pregunta por permisos, respondemos 200 inmediatamente
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { question } = req.body;

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
            timeout: 30000
        });

        return res.status(200).json({ 
            success: true, 
            answer: response.data?.data?.outputText || "Sin respuesta" 
        });

    } catch (error) {
        console.error("Error capturado:", error.message);
        return res.status(500).json({ 
            error: "Error interno", 
            message: error.message 
        });
    }
}
