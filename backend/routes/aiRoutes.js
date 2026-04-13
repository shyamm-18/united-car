const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { text: "Too many requests. Please wait." }
});

router.post('/chat', chatLimiter, async (req, res) => {
  console.log("--- AI CHAT REQUEST RECEIVED ---");
  console.log("Body:", req.body);
  
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing API Key!");
    return res.status(500).json({ text: "Missing API Key on server." });
  }

  try {
    console.log("Fetching from Gemini 2.5 Flash...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini Status:", response.status);
    
    if (!response.ok) {
      console.error("Gemini Error Data:", JSON.stringify(data));
      // Fallback response for leaked API keys or quota issues
      return res.json({ 
        text: "I am the UNITED CAR AI Concierge. My connection to the central intelligence network is currently undergoing maintenance. However, you can explore our Elite Fleet or contact our VIP support for immediate assistance.",
        isFallback: true
      });
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am offline. Please try again later.";
    console.log("Returning text length:", resultText.length);
    res.json({ text: resultText });
  } catch (error) {
    console.error("Caught Backend Error:", error);
    res.status(500).json({ text: "Error connecting to AI." });
  }
});

module.exports = router;
