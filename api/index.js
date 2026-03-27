import axios from 'axios';
import https from 'https';

// Configuración de la IA
const API_URL = "http://softgateia-api.trareysa.com:8096/api/chatbot/ask"; // HTTP si no hay certificado
const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

// httpsAgent por si necesitas HTTPS autofirmado
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
    // 1. Cabeceras obligatorias
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://trareysadoc.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, token, Authorization');

    // 2. RESPUESTA AL PREFLIGHT (ESTO ARREGLA TU ERROR ACTUAL)
    if (req.method === 'OPTIONS') {
        res.status(200).send('ok'); // Forzamos el estatus OK
        return;
    }

    // 3. Tu lógica de POST
    if (req.method === 'POST') {
        try {
            // Aquí procesas la pregunta que viene de Trareysa
            const { question } = req.body;
            
            return res.status(200).json({
                answer: "Conexión establecida con éxito.",
                status: "success"
            });
        } catch (error) {
            return res.status(500).json({ error: "Error interno" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
