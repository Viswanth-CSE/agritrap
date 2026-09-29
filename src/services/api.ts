// Client API service to talk to Express backend (Gemini proxy)
import { SensorData } from './mockData';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export async function askGemini(
  message: string, 
  currentSensor: SensorData, 
  irEventsToday: number, 
  image: string | null = null,
  cropInfo: { crop: string; stage: string } | null = null
): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sensorData: {
          temperature: currentSensor.temperature,
          humidity: currentSensor.humidity,
          ldr: currentSensor.ldr,
          uv: currentSensor.uvStatus,
          irEvents: irEventsToday
        },
        image,
        cropInfo
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Failed to connect to backend AgriTrap AI:", error);
    // Graceful fallback for offline demo
    return getFallbackAIResponse(message, currentSensor, irEventsToday, image, cropInfo);
  }
}

// Fallback logic for when backend is not running or Gemini API fails
function getFallbackAIResponse(
  message: string, 
  current: SensorData, 
  irEventsToday: number,
  image: string | null = null,
  cropInfo: { crop: string; stage: string } | null = null
): string {
  const query = message.toLowerCase();
  
  if (query.includes('why') && query.includes('high')) {
    return `### **[DEMO MODE] AgriTrap AI Assistant Analysis**

Current insect activity classification is **HIGH** based on **${irEventsToday} detection events** registered today.

**Environmental Observations:**
* **Temperature:** ${current.temperature}°C (Optimal for insect flight activity).
* **Humidity:** ${current.humidity}% (Increased moisture promotes micro-climates preferred by many agricultural field pests).
* **Light Intensity:** ${current.ldr} ADC (LDR level correlates with sunset/dusk hours when nocturnally active insects initiate movement).
* **UV Light Attraction:** **ON** (Actively attracting phototactic insect activity).
${cropInfo?.crop ? `* **Target Crop:** ${cropInfo.crop} (${cropInfo.stage || 'Flowering stage'})\n` : ''}
**Interpretation & Suggestions:**
* The elevated detection count matches these specific micro-climate readings. Note that our current sensors register activity events but cannot identify species without camera-based vision.
* **Actionable Advice:** Inspect crop leaves near the trap for leaf damage or larvae presence. Maintain UV light scheduling to track nocturnal field patterns.`;
  }
  
  if (query.includes('summary') || query.includes('today')) {
    return `### **[DEMO MODE] Field Summary**

* **Total Detection Events:** ${irEventsToday}
* **Current Temperature:** ${current.temperature}°C
* **Current Humidity:** ${current.humidity}%
* **LDR Value:** ${current.ldr} ADC
* **UV Attraction Status:** Active (ON)
${cropInfo?.crop ? `* **Crop Info:** ${cropInfo.crop} - stage: ${cropInfo.stage || 'vegetative'}\n` : ''}
**Observation Summary:** Environment conditions are moderate. Estimated insect presence matches standard field activity cycles. No critical action required at this moment.`;
  }

  if (image) {
    return `### **[DEMO MODE] Multimodal Assessment**

I have received the image attachment along with your field readings:
* **Current Temperature:** ${current.temperature}°C
* **Current Humidity:** ${current.humidity}%
${cropInfo?.crop ? `* **Crop Context:** ${cropInfo.crop} (${cropInfo.stage})` : ''}

**Image-Based Observations:**
* The local simulator indicates this could be a crop foliage insect pest (e.g. aphid, whitefly, or leafhopper).
* **IPM Recommendation:** Before applying chemical sprays, try mechanical washes, physical sticky traps, and monitor trap activity logs over the next 48 hours. Use crop-approved active ingredients only if counts cross your critical settings threshold.`;
  }

  return `### **AgriTrap AI Assistant**

I am receiving your sensor feed in real-time. Feel free to ask about temperature, humidity, insect detection peaks, or light intensity. 

*Try asking:*
* "Why is insect activity high today?"
* "Give today's summary"
* "Analyze current conditions"`;
}
