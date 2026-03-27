import axios from 'axios';
import https from 'https';

// Configuración de la IA
const API_URL = "http://softgateia-api.trareysa.com:8096/api/chatbot/ask"; // HTTP si no hay certificado
const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

// httpsAgent por si necesitas HTTPS autofirmado
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req, res) {
export default async function handler(req, res) {
    // Definimos las cabeceras permitidas
    const allowedOrigin = "https://trareysadoc.com";
    
    // Aplicamos headers manualmente
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, token, Authorization');

    // RESPUESTA CRÍTICA AL PREFLIGHT (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Tu lógica de POST
    if (req.method === 'POST') {
        try {
            // Aquí puedes procesar la pregunta de la IA
            const { question } = req.body;
            
            return res.status(200).json({
                answer: "Conexión exitosa. ¡CORS superado!",
                status: "success"
            });
        } catch (error) {
            return res.status(500).json({ error: "Error en el servidor de IA" });
        }
    }

    return res.status(405).json({ error: "Método no permitido" });
}
