import axios from 'axios';

import https from 'https';



// Configuración de la IA

const API_IA_URL = "https://softgateia-api.trareysa.com:8096/api/chatbot/ask";

const API_TOKEN = "SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });



export default async function handler(req, res) {
    // CORS para TODAS las requests
    res.setHeader('Access-Control-Allow-Origin', 'https://trareysadoc.com'); // o '*'
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token');

    if (req.method === 'OPTIONS') {
        // Preflight debe terminar aquí
        return res.status(200).end();
    }

    try {
        const { question } = req.body || {};

        if (!question) {
            return res.status(400).json({ error: "Falta 'question'" });
        }

        const response = await axios.post(
            'http://softgateia-api.trareysa.com:8096/api/chatbot/ask', // HTTP si no hay certificado
            { message: question },
            { timeout: 30000 }
        );

        return res.status(200).json({
            success: true,
            answer: response.data?.data?.outputText || "Sin respuesta"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

const axios = require('axios');



const API_URL = 'https://softgateia-api.trareysa.com:8096/api/chatbot/ask';

const TOKEN = 'SGIA-EMP-bba7729e6dae45eb9d45202b4cbd4b67';



async function askChatbot(message, vista = 'Porteadores', controladorOModulo = 'DashboardController', datosParaAnalizar = null) {

  const body = { message, vista, controladorOModulo };

  if (datosParaAnalizar && Array.isArray(datosParaAnalizar)) body.datosParaAnalizar = datosParaAnalizar;



  const { data } = await axios.post(API_URL, body, {

    headers: { 'Content-Type': 'application/json', token: TOKEN }

  });
