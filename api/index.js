import axios from 'axios';
import https from 'https';

// Configuración de la IA
const API_URL = "http://softgateia-api.trareysa.com:8096/api/chatbot/ask"; // HTTP si no hay certificado
const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

// httpsAgent por si necesitas HTTPS autofirmado
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
    // 🔹 CORS: siempre al inicio
    res.setHeader('Access-Control-Allow-Origin', 'https://trareysadoc.com'); // tu frontend
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token');

    // 🔹 Preflight OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 🔹 Solo permitimos POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { question } = req.body || {};

        if (!question) {
            return res.status(400).json({ error: "Falta 'question'" });
        }

        // 🔹 Llamada al API externa
        const { data } = await axios.post(
            API_URL,
            {
                message: question,
                vista: "CFDI",
                controladorOModulo: "SoporteCfdiController"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    token: API_TOKEN
                },
                httpsAgent,  // útil si cambias a HTTPS autofirmado
                timeout: 30000
            }
        );

        // 🔹 Respuesta al frontend
        return res.status(200).json({
            success: true,
            answer: data?.data?.outputText || "Sin respuesta"
        });

    } catch (error) {
        console.error("💥 ERROR en handler:", error);

        if (error.response) {
            console.error("📥 Response data:", error.response.data);
            console.error("📊 Status:", error.response.status);
        } else if (error.request) {
            console.error("📡 No hubo respuesta del servidor:", error.request);
        }

        return res.status(500).json({ error: error.message });
    }
}
