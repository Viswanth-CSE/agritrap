import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize official @google/genai client if key is configured
let ai = null;
if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
}

// System Instruction to feed Gemini AI model
const systemInstruction = `You are AgriTrap AI, an agricultural monitoring assistant.

Your role is to analyze sensor data collected from an ESP32-based insect monitoring trap.

Available sensors:
- IR sensor (Detects insect presence/activity events)
- LDR sensor (Measures background ambient light intensity)
- DHT22 (Measures ambient temperature & humidity)
- UV light attraction (Attracts insects during dark periods)

Rules & Constraints:
1. Never claim that the current hardware sensors can identify exact insect species. The hardware only registers presence/activity events.
2. Do not make unsupported medical, agricultural, or scientific claims.
3. Clearly distinguish between:
   - Sensor observations (e.g., Temperature, humidity, LDR levels, UV status, IR count)
   - Possible interpretations (e.g., Evening dusk is correlates with higher insect movements)
   - Recommendations (e.g., Inspect crop leaves visually near the trap)
4. When data is insufficient, say so.
5. Use simple language suitable for farmers and agricultural students.
6. Provide practical monitoring recommendations rather than guaranteed chemical pesticide or treatment instructions.`;

app.post('/api/chat', async (req, res) => {
  const { message, sensorData, image, cropInfo } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Format sensor data context to supply to Gemini model
  const context = `
Current Field Sensor Readings:
- Temperature: ${sensorData?.temperature}°C
- Humidity: ${sensorData?.humidity}%
- Light Intensity (LDR): ${sensorData?.ldr} ADC
- UV Light status: ${sensorData?.uv ? 'ON' : 'OFF'}
- IR Presence events registered today: ${sensorData?.irEvents}
${cropInfo?.crop ? `- Active Crop: ${cropInfo.crop}` : ''}
${cropInfo?.stage ? `- Crop Growth Stage: ${cropInfo.stage}` : ''}
`;

  const prompt = `${context}\n\nUser Question: ${message}`;

  if (!ai) {
    console.log("No GEMINI_API_KEY configured. Falling back to simulated response.");
    let reply = `### **[LOCAL SIMULATOR] AgriTrap AI Response**

Google Gemini API key not detected in backend \`.env\` configuration. Running in simulation mode.

**Interpretation based on context:**
* Today's Events: ${sensorData?.irEvents || 0} detections.
* Field Temperature: ${sensorData?.temperature || 'N/A'}°C
* Field Humidity: ${sensorData?.humidity || 'N/A'}%
* UV Attraction Light: ${sensorData?.uv ? 'Active' : 'Inactive'}
${cropInfo?.crop ? `* Crop: ${cropInfo.crop} (${cropInfo.stage || 'Unknown stage'})` : ''}`;

    if (image) {
      reply += `\n\n🔎 **[IMAGE ANALYSIS SIMULATION]**\nAn image upload was received. The local simulator cannot analyze raw image pixels, but has registered the file attachment. If this represents a common field pest like aphids, mites, or caterpillars, review organic biological controls (e.g. neem oil, soapy water wash) before turning to crop-approved chemicals.`;
    }

    return res.json({ reply });
  }

  try {
    const contents = [];

    // If base64 image is supplied, transform it into Gemini Part structure
    if (image && image.includes('base64,')) {
      const parts = image.split(';base64,');
      const mimeType = parts[0].split(':')[1];
      const base64Data = parts[1];

      contents.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    // Add main query prompt
    contents.push(prompt);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const replyText = response.text || "No response text was generated.";
    res.json({ reply: replyText });
  } catch (error) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ error: "Failed to generate content from Gemini AI." });
  }
});

app.listen(PORT, () => {
  console.log(`AgriTrap backend server listening on port ${PORT}`);
});
