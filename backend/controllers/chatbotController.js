const {
  sendMessage,
  getFarmingAdvice,
  getPestAdvice: groqPestAdvice,
  initializeChat,
} = require("../services/geminiService");

// Initialize Groq on startup
initializeChat().catch((err) => {
  console.error("Failed to initialize Groq:", err);
});

// Chat endpoint - for streaming conversation
const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await sendMessage(message);

    res.json({
      success: true,
      message,
      response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get response from chatbot",
    });
  }
};

// Farming advisory endpoint
const getAdvisory = async (req, res) => {
  try {
    const { query, cropName = "general", location = "India" } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const advice = await getFarmingAdvice(query, cropName, location);

    res.json({
      success: true,
      query,
      advice,
      cropName,
      location,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Advisory error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get farming advice",
    });
  }
};

// Pest advisory chatbot
const getPestAdvice = async (req, res) => {
  try {
    const { pestName, symptoms, cropName, location = "India" } = req.body;

    if (!pestName || !cropName) {
      return res
        .status(400)
        .json({ error: "Pest name and crop name are required" });
    }

    const advice = await groqPestAdvice(pestName, cropName, location);

    res.json({
      success: true,
      pestName,
      cropName,
      location,
      symptoms,
      advice,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Pest advice error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get pest advice",
    });
  }
};

// Crop specific advice
const getCropAdvice = async (req, res) => {
  try {
    const { cropName, stage = "general", region = "India" } = req.body;

    if (!cropName) {
      return res.status(400).json({ error: "Crop name is required" });
    }

    const query = `Provide detailed advice for ${cropName} farming at the ${stage} stage in ${region}. 
Include fertilizer schedule, water requirements, pest management, and expected yield.`;

    const advice = await sendMessage(query);

    res.json({
      success: true,
      cropName,
      stage,
      region,
      advice,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Crop advice error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get crop advice",
    });
  }
};

module.exports = {
  chat,
  getAdvisory,
  getPestAdvice,
  getCropAdvice,
};
