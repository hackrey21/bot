import axios from 'axios';
import https from 'https';

// Configuración de la IA
const API_URL = "http://softgateia-api.trareysa.com:8096/api/chatbot/ask"; // HTTP si no hay certificado
const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

// httpsAgent por si necesitas HTTPS autofirmado
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
    // Cabeceras CORS mínimas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responder al Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Responder al POST
    if (req.method === 'POST') {
        return res.status(200).json({ 
            answer: "¡Servidor vivo! Si ves esto, el error de CORS y el 500 se acabaron.",
            status: "success" 
        });
    }

    // Si entras desde el navegador (GET)
    return res.status(200).send("El servidor está funcionando correctamente.");
}
