import axios from 'axios';
import https from 'https';

const API_IA_URL = "https://softgateia-api.trareysa.com:8096/api/chatbot/ask";
const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

// Agente para ignorar problemas de certificado en el servidor de Trareysa
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
    // 1. CONFIGURACIÓN DE CORS (Crucial para que trareysadoc.com pueda entrar)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token, Authorization');

    // 2. RESPUESTA RÁPIDA A OPTIONS (El "permiso de vuelo" del navegador)
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

        const result = response.data;
        const answer = result?.data?.outputText || "Sin respuesta del servidor";

        return res.status(200).json({ 
            success: true, 
            answer: answer 
        });

    } catch (error) {
        console.error("Error en API:", error.response?.data || error.message);
        return res.status(500).json({ 
            error: "Error en la comunicación con la IA", 
            details: error.response?.data || error.message 
        });
    }
}
