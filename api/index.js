import axios from 'axios';
import https from 'https';

// Configuración de la IA
const API_IA_URL = "https://softgateia-api.trareysa.com:8096/api/chatbot/ask";
const API_TOKEN  = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

export default async function handler(req, res) {
    // CORS — se aplica a TODAS las peticiones (incluyendo preflight OPTIONS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token');

    // Responder al preflight del navegador
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { question } = req.body;

        // httpsAgent dentro de la función para evitar problemas en cold start
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        const response = await axios.post(API_IA_URL, {
            message: question,
            vista: "CFDI",
            controladorOModulo: "SoporteCfdiController"
        }, {
            headers: { "token": API_TOKEN },
            httpsAgent,
            timeout: 30000
        });

        return res.status(200).json({
            success: true,
            answer: response.data?.data?.outputText || "Sin respuesta"
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
