const Groq = require("groq-sdk");

// Initialize Groq
console.log("🔑 GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);
console.log("🔑 GROQ_API_KEY length:", process.env.GROQ_API_KEY?.length);
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Farming-specific system instruction
const FARMING_SYSTEM_INSTRUCTION = `You are an expert farming advisor specializing in Indian agriculture. 
You provide practical, actionable advice for farmers about:
- Crop cultivation and best practices
- Pest and disease management
- Soil health and fertilizer recommendations
- Water management and irrigation
- Seasonal farming guidance
- Government schemes and subsidies
- Market trends and pricing
- Weather adaptation strategies

Always provide responses in simple, farmer-friendly language.
Include practical tips and local practices when relevant.
Keep responses concise and actionable.
If asked about specific locations, provide location-relevant advice.`;

// Chat history to maintain conversation context
let chatHistory = [
  {
    role: "system",
    content: FARMING_SYSTEM_INSTRUCTION,
  },
  {
    role: "user",
    content: "Hello! I am a farmer looking for agricultural advice.",
  },
  {
    role: "assistant",
    content:
      "Hello! I'm your farming advisor. I'm here to help you with any questions about crop cultivation, pest management, soil health, irrigation, or farming techniques. Ask me anything about your farming needs, and I'll provide practical advice tailored to Indian farming conditions.",
  },
];

// Initialize chat session
async function initializeChat() {
  try {
    console.log("✅ Groq chat session initialized");
    return true;
  } catch (error) {
    console.error("❌ Error initializing Groq chat:", error.message);
    throw error;
  }
}

// Fallback farming advice when API is down
function getFallbackAdvice(message) {
  const message_lower = message.toLowerCase();

  // Crop-specific advice
  const cropAdvice = {
    sugarcane:
      "Sugarcane requires 1200-1500mm rainfall annually. Plant in November-December. Use quality seed cane (40,000-50,000 buds/hectare). Apply NPK (120:60:60 kg/ha). Irrigate every 10-14 days during dry season. Harvest after 12 months when brix reaches 20-21°. Watch for red rot disease and scale insects. Intercrop with legumes for soil health.",
    rice: "Rice needs 1200-1500mm water. Use quality certified seeds at 40-50 kg/ha. Apply NPK (120:60:40 kg/ha) in splits. Maintain 5cm standing water. Use disease-resistant varieties. Harvest at 20-25% moisture content when crop turns golden. Yields: 40-50 quintals/hectare with good management.",
    wheat:
      "Wheat is a winter crop (October-March). Sow at 100-125 kg/ha. Apply NPK (120:60:40 kg/ha). Irrigate 4-5 times during season. Optimal temperature: 20-25°C. Monitor Septoria, rust diseases. Harvest when moisture drops to 12-13%. Expected yield: 40-50 quintals/hectare.",
    cotton:
      "Cotton needs 600-1000mm rain. Sow April-May at 20 kg/ha. Space: 90x60cm. Apply NPK (120:60:60 kg/ha). Irrigate 8-10 times. Common pests: bollworm, whitefly, jassids. Use Bt cotton variety. Harvest September-November. Yield: 15-20 quintals/hectare.",
    potato:
      "Potato needs 500-700mm water. Plant February-March. Use 20-25 tons FYM/ha. Apply NPK (150:100:100 kg/ha). Ridge and furrow method. Irrigate every 10-15 days. Watch for late blight, early blight. Harvest after 90-120 days when foliage dries. Yield: 20-25 tons/hectare.",
    maize:
      "Maize needs 500-750mm rain. Sow June-July at 20 kg/ha. Space: 60x25cm. Apply NPK (120:80:40 kg/ha). Irrigate 4-6 times. Use hybrid seeds for higher yield. Monitor stem borer pest. Harvest when moisture reaches 20%. Yield: 40-50 quintals/hectare.",
    tomato:
      "Tomatoes need 50-100cm rain. Plant in nursery first. Transplant at 45 days. Space: 60x45cm. Apply NPK (100:100:150 kg/ha). Irrigate every 5-7 days. Use drip irrigation. Prune suckers. Harvest green or ripe. Yields: 20-30 tons/hectare. Watch for fruit rot and blight.",
    onion:
      "Onions need 600-750mm water. Plant November-December. Space: 15x10cm. Apply NPK (120:80:100 kg/ha). Mulch to prevent weeds. Irrigate every 8-10 days. Harvest when tops fall (May-June). Cure in shade for 2 weeks. Yield: 15-20 tons/hectare.",
  };

  // Check for specific crop
  for (const [crop, advice] of Object.entries(cropAdvice)) {
    if (message_lower.includes(crop)) {
      return advice;
    }
  }

  // Generic keyword-based responses
  const fallbackResponses = {
    crop: "For optimal crop yield, ensure proper irrigation, use quality seeds, maintain soil pH 6.0-7.5, and apply balanced fertilizers (NPK). Monitor for pests weekly and follow crop rotation practices.",
    water:
      "Water management is crucial. Most crops need 600-900mm annually. Water in early morning or evening to reduce evaporation. Use drip irrigation for efficiency and check soil moisture before watering.",
    pest: "Common pests can be managed with neem oil spray (2ml/liter), beneficial insects, pheromone traps, or manual picking. For severe infestations, consult local agricultural officers for approved pesticides.",
    soil: "Maintain soil health by adding organic matter, checking pH regularly, and rotating crops. Conduct soil testing annually. Add compost or farm manure for nutrient enrichment.",
    fertilizer:
      "Use balanced fertilizers at different crop stages - Nitrogen (46:0:0) during growth, Phosphorus and Potassium (0:18:46) during flowering. Follow recommended rates for your specific crop.",
    weather:
      "Monitor local weather patterns. Adjust irrigation and pesticide application accordingly. Use weather forecasts to plan farm activities. Protect crops during extreme weather.",
    disease:
      "Plant diseases spread through contaminated soil, water, or tools. Use disease-resistant varieties. Maintain field hygiene. Rotate crops annually. Use fungicides like mancozeb or copper sulfate if needed.",
    yield:
      "To improve yield: use high-quality seeds, maintain optimal spacing, apply balanced nutrients, irrigate properly, control pests/diseases timely, and follow recommended harvesting practices.",
    default:
      "Thank you for your farming question. For specific crop advice, please mention the crop name. Common crops: Rice, Wheat, Maize, Sugarcane, Cotton, Potato, Tomato, Onion. Consult local agricultural officers for region-specific guidance.",
  };

  for (const [key, response] of Object.entries(fallbackResponses)) {
    if (message_lower.includes(key)) {
      return response;
    }
  }
  return fallbackResponses.default;
}

// Send message to Groq
async function sendMessage(userMessage) {
  try {
    // Add user message to history
    chatHistory.push({
      role: "user",
      content: userMessage,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: chatHistory,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = chatCompletion.choices[0].message.content;

    // Add assistant response to history
    chatHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Keep chat history manageable (last 10 messages + system message)
    if (chatHistory.length > 21) {
      chatHistory = [
        chatHistory[0], // Keep system message
        ...chatHistory.slice(-20), // Keep last 20 messages
      ];
    }

    return assistantMessage;
  } catch (error) {
    console.error("⚠️ Groq API error, using fallback:", error.message);
    // Return fallback response if API fails
    return getFallbackAdvice(userMessage);
  }
}

// Get farming advice for specific crop
async function getFarmingAdvice(
  query,
  cropName = "general",
  location = "India",
) {
  try {
    const enhancedQuery = `
Provide farming advice for ${cropName} farming in ${location}.
Question: ${query}

Please provide practical, actionable advice suitable for Indian farmers.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: FARMING_SYSTEM_INSTRUCTION,
        },
        {
          role: "user",
          content: enhancedQuery,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error(
      "⚠️ Groq API error for farming advice, using fallback:",
      error.message,
    );
    return getFallbackAdvice(`${cropName} ${query}`);
  }
}

// Get pest management advice
async function getPestAdvice(pestName, cropName, location = "India") {
  try {
    const query = `What are the best ways to manage ${pestName} in ${cropName} farming in ${location}? 
Provide prevention methods, organic solutions, and when to use chemical treatments.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: FARMING_SYSTEM_INSTRUCTION,
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error(
      "⚠️ Groq API error for pest advice, using fallback:",
      error.message,
    );
    return `For ${pestName} management in ${cropName}: Use neem oil spray (2ml/liter), beneficial insects like ladybugs, pheromone traps, and manual picking. For severe infestations, consult local agricultural extension officers. Practice crop rotation and maintain field hygiene.`;
  }
}

// Get soil management advice
async function getSoilAdvice(soilType, cropName, location = "India") {
  try {
    const query = `Give me soil management and fertilizer recommendations for ${cropName} farming on ${soilType} soil in ${location}.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: FARMING_SYSTEM_INSTRUCTION,
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error getting soil advice:", error.message);
    throw new Error(`Failed to get soil advice: ${error.message}`);
  }
}

// Reset chat session
function resetChat() {
  chatHistory = [
    {
      role: "system",
      content: FARMING_SYSTEM_INSTRUCTION,
    },
    {
      role: "user",
      content: "Hello! I am a farmer looking for agricultural advice.",
    },
    {
      role: "assistant",
      content:
        "Hello! I'm your farming advisor. I'm here to help you with any questions about crop cultivation, pest management, soil health, irrigation, or farming techniques. Ask me anything about your farming needs, and I'll provide practical advice tailored to Indian farming conditions.",
    },
  ];
  console.log("🔄 Chat session reset");
}

module.exports = {
  initializeChat,
  sendMessage,
  getFarmingAdvice,
  getPestAdvice,
  getSoilAdvice,
  resetChat,
};
