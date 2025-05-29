const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.post("/genData", async (req, res) => {
    const { schema, api_key, prompt } = req.body;
    if (!schema || !api_key || !prompt) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!validateSchemaStructure(schema)) {
        return res.status(400).json({ error: 'Invalid schema format' });
    }
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Invalid prompt format' });
    }
    if (!api_key || typeof api_key !== 'string') {
        return res.status(400).json({ error: 'Invalid API key format' });
    }
    try {

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "responseSchema": { ...schema }
                    }
                })
            }).then(res => {
                return res.json();
            });
        console.log(response)
        if(response?.error && response?.error?.message?.includes("API key not valid. Please pass a valid API key")){
            return res.status(401).json({ error: 'Invalid API key' });
        }
        const geminiOutput = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        res.json(geminiOutput || 'No content returned from Gemini');
    } catch (error) {
        console.error('Gemini API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate content from Gemini' });
    }
})

module.exports = router;


function validateSchemaStructure(schema) {
    if (
        typeof schema !== 'object' || schema === null ||
        schema.type !== 'ARRAY' ||
        typeof schema.items !== 'object' || schema.items === null ||
        schema.items.type !== 'OBJECT' ||
        typeof schema.items.properties !== 'object' || schema.items.properties === null ||
        !Array.isArray(schema.propertyOrdering)
    ) {
        return false;
    }

    return true;
}
