const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { text: "Too many requests. Please wait." }
});

router.post('/chat', chatLimiter, async (req, res) => {
  const { message, fleetData } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("AI Error: Missing GEMINI_API_KEY in .env");
    return res.status(500).json({ text: "The AI system is currently in standby mode. Please contact support." });
  }

  try {
    // Construct System Instruction
    const fleetSummary = fleetData ? fleetData.map(c => `${c.brand} ${c.model} (starts at ₹${c.pricePerDay}/day)`).join(', ') : 'Various luxury and SUV models';
    
    const systemInstruction = `
      You are the "UNITED CAR AI Concierge", an elite digital assistant for UNITED CAR, the leading luxury car rental provider in JAIPUR, RAJASTHAN (Pin: 302020).
      
      Your goal is to assist customers with fleet inquiries, bookings, and premium services.
      
      KEY BUSINESS FACTS:
      - Location: Jaipur, Rajasthan 302020.
      - Fleet: We offer premium SUVs, Luxury sedans, and Sports cars. Our specific fleet includes: ${fleetSummary}.
      - Services: Self-drive rentals, Chauffeur-driven services, Wedding car rentals, and Airport transfers.
      - Contact: Phone (9216497682), Email (arebhai09@gmail.com).
      
      TONE: Professional, luxury-focused, polite, and helpful. Use Hindi-English (Hinglish) occasionally if appropriate for an Indian audience, but keep it sophisticated. 
      
      IMPORTANT FORMATTING RULES:
      - DO NOT use markdown formatting like asterisks (**) or double asterisks for bolding words. 
      - DO NOT use hashtags (#) for headers.
      - Use clean, professional plain text ONLY. If you need to emphasize something, use capitalized words or clear wording instead of markdown symbols.
      
      User Message: ${message}
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemInstruction }] }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Gemini API failed");
    }

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am currently processing your request. How else can I assist you with our fleet in Jaipur?";
    res.json({ text: resultText });

  } catch (error) {
    console.error("AI Backend Exception:", error);
    res.json({ 
      text: "I am having trouble connecting to my central network. However, I can tell you that UNITED CAR offers the best luxury rentals in Jaipur. Please call us at 9216497682 for immediate booking.",
      fallback: true 
    });
  }
});

module.exports = router;
