import axios from 'axios';
import https from 'https';

const API_IA_URL = "https://softgateia-api.trareysa.com:8096/api/chatbot/ask";
const API_TOKEN  = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

export default async function handler(req, res) {
    console.log("🔥 Nueva petición recibida");
    console.log("Método:", req.method);
    console.log("Body:", req.body);

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token');

    if (req.method === 'OPTIONS') {
        console.log("🟡 Preflight OPTIONS");
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        console.log("❌ Método no permitido");
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { question } = req.body;

        console.log("🧠 Question:", question);

        if (!question) {
            console.log("⚠️ No viene question en el body");
            return res.status(400).json({ error: "Falta 'question'" });
        }

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        console.log("📡 Haciendo request a API externa...");

        const response = await axios.post(API_IA_URL, {
            message: question,
            vista: "CFDI",
            controladorOModulo: "SoporteCfdiController"
        }, {
            headers: { token: API_TOKEN },
            httpsAgent,
            timeout: 30000
        });

        console.log("✅ Respuesta recibida:");
        console.log("Status:", response.status);
        console.log("Data:", response.data);

        return res.status(200).json({
            success: true,
            answer: response.data?.data?.outputText || "Sin respuesta"
        });

    } catch (error) {
        console.error("💥 ERROR COMPLETO:");

        // Error general
        console.error("Message:", error.message);

        // Axios error detallado
        if (error.response) {
            console.error("📥 Response data:", error.response.data);
            console.error("📊 Status:", error.response.status);
            console.error("📑 Headers:", error.response.headers);
        } else if (error.request) {
            console.error("📡 No hubo respuesta del servidor:", error.request);
        } else {
            console.error("⚙️ Error configurando request:", error);
        }

        console.error("Stack:", error.stack);

        return res.status(500).json({
            error: "Error interno",
            details: error.message
        });
    }
}
