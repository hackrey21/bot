import axios from 'axios';
import https from 'https';

// Configuración de la IA
const API_URL = "http://softgateia-api.trareysa.com:8096/api/chatbot/ask"; // HTTP si no hay certificado
const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

// httpsAgent por si necesitas HTTPS autofirmado
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
    // 1. Cabeceras de Poder (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. Responder al Preflight del navegador
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Respuesta de prueba
    try {
        return res.status(200).json({
            answer: "Servidor funcionando correctamente. El error 500 ha desaparecido.",
            status: "success"
        });
    } catch (e) {
        return res.status(500).json({ error: "Error interno" });
    }
}
