// Knowledge Hub Controller

const knowledgeBase = [
  {
    id: "1",
    title: "How to Identify Early Blight in Tomatoes",
    category: "Pest Management",
    content:
      "Early blight appears as circular brown spots with concentric rings on lower leaves...",
    type: "article",
    author: "Agricultural Expert",
    date: new Date(),
  },
  {
    id: "2",
    title: "Organic Farming Techniques",
    category: "Organic Farming",
    content:
      "Organic farming focuses on sustainable practices without synthetic chemicals...",
    type: "article",
    author: "Sustainability Expert",
    date: new Date(),
  },
  {
    id: "3",
    title: "Soil Health Management",
    category: "Soil Science",
    content: "Healthy soil is the foundation of successful farming...",
    type: "guide",
    author: "Soil Expert",
    date: new Date(),
  },
];

// Get all articles
const getAllArticles = (req, res) => {
  try {
    const { category, type, searchTerm } = req.query;

    let filtered = [...knowledgeBase];

    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (type) {
      filtered = filtered.filter((item) => item.type === type);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    res.json({
      total: filtered.length,
      articles: filtered,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching articles", error: error.message });
  }
};

// Get article details
const getArticleDetails = (req, res) => {
  try {
    const { articleId } = req.params;

    const article = knowledgeBase.find((item) => item.id === articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching article", error: error.message });
  }
};

// Get categories
const getCategories = (req, res) => {
  try {
    const categories = [...new Set(knowledgeBase.map((item) => item.category))];

    res.json({
      total: categories.length,
      categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

// Get pesticide guidelines
const getPesticideGuidelines = (req, res) => {
  try {
    const guidelines = [
      {
        pesticide: "Neem Oil",
        type: "Organic",
        dosage: "3% spray",
        application: "Early morning or evening",
        daysToHarvest: "7 days",
        crops: ["Rice", "Vegetables", "Pulses"],
      },
      {
        pesticide: "Bacillus Thuringiensis",
        type: "Organic",
        dosage: "1 ml/liter",
        application: "Early morning",
        daysToHarvest: "0 days",
        crops: ["Vegetables", "Pulses", "Cotton"],
      },
      {
        pesticide: "Spinosad 45% SC",
        type: "Chemical",
        dosage: "2 ml/liter",
        application: "Evening",
        daysToHarvest: "3 days",
        crops: ["Rice", "Vegetables", "Pulses"],
      },
    ];

    res.json({
      total: guidelines.length,
      guidelines,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching guidelines", error: error.message });
  }
};

// Get organic tips
const getOrganicTips = (req, res) => {
  try {
    const tips = [
      {
        id: 1,
        title: "Composting",
        description: "Make your own compost from farm waste",
        steps: [
          "Collect farm waste",
          "Layer with manure",
          "Keep moist for 3-4 months",
          "Use when ready",
        ],
      },
      {
        id: 2,
        title: "Crop Rotation",
        description: "Rotate crops to maintain soil health",
        steps: [
          "Plan 3-4 year rotation",
          "Alternate legumes with cereals",
          "Monitor soil health",
          "Document results",
        ],
      },
      {
        id: 3,
        title: "Green Manuring",
        description: "Use legumes to enrich soil",
        steps: [
          "Sow legume crops",
          "Allow 45-60 days growth",
          "Plow into soil",
          "Ready for main crop",
        ],
      },
    ];

    res.json({
      total: tips.length,
      tips,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tips", error: error.message });
  }
};

// Get crop cultivation guides
const getCropGuides = (req, res) => {
  try {
    const { cropName } = req.query;

    const guides = {
      rice: {
        crop: "Rice",
        season: "Kharif/Rabi",
        duration: "120-150 days",
        soilType: "Clay loam to clay",
        waterRequirement: "1200-1500 mm",
        fertilizer: "NPK 120:60:40 kg/ha",
        yield: "40-60 quintals/ha",
        steps: [
          "Nursery preparation",
          "Field preparation",
          "Transplanting",
          "Weeding and maintenance",
          "Harvesting",
        ],
      },
      wheat: {
        crop: "Wheat",
        season: "Rabi",
        duration: "120-150 days",
        soilType: "Loamy to clay loam",
        waterRequirement: "400-600 mm",
        fertilizer: "NPK 100:50:30 kg/ha",
        yield: "30-40 quintals/ha",
        steps: [
          "Land preparation",
          "Sowing",
          "Germination",
          "Growth phase",
          "Harvesting",
        ],
      },
    };

    const guide = cropName ? guides[cropName.toLowerCase()] : guides;

    res.json(guide || { message: "Guide not found" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching guide", error: error.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleDetails,
  getCategories,
  getPesticideGuidelines,
  getOrganicTips,
  getCropGuides,
};
