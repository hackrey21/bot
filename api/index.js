import axios from 'axios';
import https from 'https';

// Configuración de la IA
const API_IA_URL = "https://softgateia-api.trareysa.com:8096/api/chatbot/ask";
const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
    // Manejo de CORS manual (para que no vuelva el error anterior)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token');

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
            "Content-Type": "application/json" // Aseguramos el tipo de contenido
        },
        httpsAgent: httpsAgent,
        timeout: 30000
    });

    // Validamos qué estamos recibiendo realmente
    const result = response.data;
    const answer = result?.data?.outputText || "Sin respuesta del servidor";

    return res.status(200).json({ 
        success: true, 
        answer: answer,
        fullResponse: result // Opcional: para debug
    });

} catch (error) {
    // Si la API responde con un error (4xx, 5xx), axios lo lanza aquí
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message;
    
    return res.status(status).json({ 
        error: "Error en la comunicación con la IA", 
        details: message 
    });
}
}
