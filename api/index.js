import axios from 'axios';
import https from 'https';

// Configuración de la IA
const API_IA_URL = "https://trak-smart.trareysa.com:8093/api/chatbot/ask";
const API_TOKEN = "APIKEY_EMPRESA_SOFTGATE_001";
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
            headers: { "token": API_TOKEN },
            httpsAgent: httpsAgent,
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
