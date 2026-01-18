import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FaSearch,
  FaClock,
  FaEye,
  FaBookmark,
  FaRegBookmark,
  FaPlay,
  FaLeaf,
  FaCloudSun,
  FaTractor,
  FaBug,
  FaFilePdf,
  FaGraduationCap,
  FaStar,
  FaArrowRight,
  FaAdjust,
  FaUniversalAccess,
} from "react-icons/fa";

const createKnowledgeItems = (t) => [
  // Articles
  {
    id: "art-1",
    title: t("Integrated Pest Management for Cotton"),
    category: t("Pests & Disease"),
    type: "Article",
    crop: "Cotton",
    season: "Kharif",
    region: "Maharashtra",
    problem: "Bollworm",
    tags: [t("Pests"), t("Crops")],
    timeToRead: "8 " + t("min"),
    views: 1820,
    updated: "2d " + t("ago"),
    level: t("Intermediate"),
    summary:
      "AI summary: Monitor pink bollworm traps weekly; rotate insecticides; maintain field hygiene to lower pressure.",
    content: `**Introduction:**\nPink bollworm is one of the most destructive pests affecting cotton cultivation, causing significant yield losses if not managed properly.\n\n**Monitoring:**\n• Install pheromone traps at 5-6 traps per acre\n• Check traps weekly and record moth counts\n• Economic threshold: 8 moths per trap per week\n\n**Cultural Practices:**\n• Remove and destroy crop residues after harvest\n• Deep ploughing in summer to expose pupae\n• Grow trap crops like bhindi around field borders\n• Maintain field sanitation\n\n**Chemical Control:**\n• Rotate insecticide groups to prevent resistance\n• Apply spinosad or emamectin benzoate when threshold is reached\n• Avoid consecutive applications of same chemical\n• Follow pre-harvest interval (PHI) guidelines\n\n**Integrated Approach:**\nCombine cultural, biological, and chemical methods for best results. Regular monitoring is key to timely intervention.`,
  },
  {
    id: "art-2",
    title: t("Sustainable Rice Farming: Zero Tillage Method"),
    category: t("Crop Cultivation"),
    type: "Article",
    crop: "Rice",
    season: "Kharif",
    region: "Punjab",
    problem: t("Soil degradation"),
    tags: [t("Crops"), "Soil"],
    timeToRead: "10 " + t("min"),
    views: 2100,
    updated: "1d " + t("ago"),
    level: t("Intermediate"),
    summary:
      "Learn how zero tillage reduces costs by 15-20%, improves soil health, and increases water retention for sustainable paddy cultivation.",
  },
  {
    id: "art-3",
    title: t("Wheat Crop Management: Seed to Harvest"),
    category: t("Crop Cultivation"),
    type: "Article",
    crop: "Wheat",
    season: "Rabi",
    region: "Pan India",
    problem: t("Yield optimization"),
    tags: [t("Crops")],
    timeToRead: "12 " + t("min"),
    views: 3200,
    updated: "3d " + t("ago"),
    level: t("Beginner"),
    summary:
      "Complete guide covering seed selection, land preparation, sowing techniques, irrigation schedule, fertilizer application, and harvesting best practices.",
  },
  {
    id: "art-4",
    title: t("Market Outlook: Paddy MSP & Local Demand"),
    category: t("Market Insights"),
    type: "Article",
    crop: "Paddy",
    season: "Kharif",
    region: "Telangana",
    problem: t("Pricing"),
    tags: [t("Market")],
    timeToRead: "5 " + t("min"),
    views: 2320,
    updated: "1d " + t("ago"),
    level: t("All"),
    summary:
      "AI summary: MSP likely steady; local mill demand rising post-harvest; consider staggered sales to capture price lift.",
  },
  {
    id: "art-5",
    title: t("Soil Health Card: How to Read & Act"),
    category: "Soil & Fertility",
    type: "Article",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Nutrient management"),
    tags: ["Soil"],
    timeToRead: "7 " + t("min"),
    views: 980,
    updated: "7d " + t("ago"),
    level: t("Beginner"),
    summary:
      "AI summary: Match NPK recommendations to crop stage; prioritize organic matter if OC <0.5; retest soil every 2 years.",
  },
  {
    id: "art-6",
    title: t("Disease Identification in Potato Crops"),
    category: t("Pests & Disease"),
    type: "Article",
    crop: "Potato",
    season: "Rabi",
    region: "West Bengal",
    problem: t("Late blight"),
    tags: [t("Pests"), t("Crops")],
    timeToRead: "9 " + t("min"),
    views: 1650,
    updated: "4d " + t("ago"),
    level: t("Intermediate"),
    summary:
      "Identify late blight early signs: water-soaked lesions on leaves. Apply copper fungicide preventively; ensure proper spacing for air circulation.",
  },
  {
    id: "art-7",
    title: t("Precision Agriculture: IoT Sensors for Farms"),
    category: t("Technology"),
    type: "Article",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Farm monitoring"),
    tags: [t("Technology")],
    timeToRead: "11 " + t("min"),
    views: 890,
    updated: "5d " + t("ago"),
    level: t("Advanced"),
    summary:
      "Explore how soil moisture sensors, weather stations, and crop cameras help optimize irrigation, predict diseases, and improve yields by 20-30%.",
  },

  // Organic Farming Tips
  {
    id: "organic-1",
    title: t("Organic Farming: Natural Pest Control Methods"),
    category: t("Organic Farming"),
    type: "Article",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Chemical-free pest control"),
    tags: [t("Organic"), t("Pests")],
    timeToRead: "10 " + t("min"),
    views: 2450,
    updated: "2d " + t("ago"),
    level: t("Beginner"),
    summary:
      "Use neem oil spray (5ml/liter), pheromone traps, and companion planting (marigold with tomato). Introduce beneficial insects like ladybugs and parasitic wasps.",
  },
  {
    id: "organic-2",
    title: t("Composting Guide: From Waste to Nutrient-Rich Fertilizer"),
    category: t("Organic Farming"),
    type: t("GUIDE"),
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Organic matter"),
    tags: [t("Organic"), "Soil"],
    timeToRead: "8 " + t("min"),
    views: 1920,
    updated: "3d " + t("ago"),
    level: t("Beginner"),
    summary:
      "Layer green waste (50%) with brown matter (50%); maintain moisture at 60%; turn weekly. Ready in 45-60 days with earthy smell and dark color.",
  },
  {
    id: "organic-3",
    title: t("Vermicomposting: Black Gold for Your Fields"),
    category: t("Organic Farming"),
    type: "Article",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Soil enrichment"),
    tags: [t("Organic"), "Soil"],
    timeToRead: "7 " + t("min"),
    views: 1340,
    updated: "6d " + t("ago"),
    level: t("Beginner"),
    summary:
      "Use Eisenia fetida earthworms; feed kitchen waste and farm residue. Harvest vermicompost in 60 days; rich in NPK and beneficial microbes.",
  },
  {
    id: "organic-4",
    title: t("Bio-Fertilizers: Boosting Soil Microbiology Naturally"),
    category: t("Organic Farming"),
    type: "Article",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Chemical fertilizer reduction"),
    tags: [t("Organic"), "Soil"],
    timeToRead: "9 " + t("min"),
    views: 1580,
    updated: "4d " + t("ago"),
    level: t("Intermediate"),
    summary:
      "Rhizobium for legumes, Azotobacter for cereals, PSB for phosphorus mobilization. Apply 250g/acre mixed with compost at sowing.",
  },
  {
    id: "organic-5",
    title: t("Green Manuring: Dhaincha and Sesbania Benefits"),
    category: t("Organic Farming"),
    type: t("GUIDE"),
    crop: "Rice",
    season: "Kharif",
    region: "Pan India",
    problem: t("Nitrogen deficiency"),
    tags: [t("Organic"), t("Crops")],
    timeToRead: "6 " + t("min"),
    views: 1120,
    updated: "8d " + t("ago"),
    level: t("Beginner"),
    summary:
      "Sow dhaincha 45 days before transplanting; plow in at flowering. Adds 60-80kg N/ha naturally; improves soil structure and water retention.",
  },

  // Pesticide Guidelines
  {
    id: "pest-guide-1",
    title: t("Safe Pesticide Application: Dos and Don'ts"),
    category: t("Pesticide Guidelines"),
    type: t("GUIDE"),
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Pesticide safety"),
    tags: [t("Pests"), t("Safety")],
    timeToRead: "10 " + t("min"),
    views: 2890,
    updated: "1d " + t("ago"),
    level: t("Beginner"),
    summary:
      "Always wear PPE (mask, gloves, boots); spray early morning or evening; follow label dosage; maintain 3-day PHI for vegetables, 7-day for fruits.",
  },
  {
    id: "pest-guide-2",
    title: t("Pesticide Resistance Management Strategies"),
    category: t("Pesticide Guidelines"),
    type: "Article",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Resistance development"),
    tags: [t("Pests")],
    timeToRead: "8 " + t("min"),
    views: 1450,
    updated: "3d " + t("ago"),
    level: t("Intermediate"),
    summary:
      "Rotate pesticide groups (MoA); avoid consecutive applications of same chemical. Integrate bio-pesticides; use threshold-based spraying.",
  },
  {
    id: "pest-guide-3",
    title: t("Pre-Harvest Interval (PHI): Why It Matters"),
    category: t("Pesticide Guidelines"),
    type: "Article",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Residue safety"),
    tags: [t("Pests"), t("Safety")],
    timeToRead: "5 " + t("min"),
    views: 1230,
    updated: "5d " + t("ago"),
    level: t("Beginner"),
    summary:
      "PHI is the minimum days between last spray and harvest. Violating PHI leads to toxic residues. Check product label; typically 3-15 days.",
  },
  {
    id: "pest-guide-4",
    title: t("Calibration of Sprayers: Get the Dose Right"),
    category: t("Pesticide Guidelines"),
    type: t("GUIDE"),
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Spray accuracy"),
    tags: [t("Pests")],
    timeToRead: "7 " + t("min"),
    views: 980,
    updated: "7d " + t("ago"),
    level: t("Intermediate"),
    summary:
      "Calibrate sprayer by measuring water output per acre. Adjust nozzle pressure; test spray pattern. Under-dosing = poor control; over-dosing = wastage + toxicity.",
  },
  {
    id: "pest-guide-5",
    title: t("Disposal of Empty Pesticide Containers Safely"),
    category: t("Pesticide Guidelines"),
    type: "Article",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Environmental safety"),
    tags: [t("Pests"), t("Safety")],
    timeToRead: "4 " + t("min"),
    views: 750,
    updated: "9d " + t("ago"),
    level: t("Beginner"),
    summary:
      "Triple rinse containers; puncture to prevent reuse; hand over to authorized collection centers. Never reuse for water/food storage.",
  },

  // Videos
  {
    id: "vid-1",
    title: t("Video: Drip Irrigation System - How It Works"),
    category: t("Irrigation"),
    type: "Video",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Water stress"),
    tags: [t("Water"), t("Crops")],
    timeToRead: "15 " + t("min"),
    views: 3200,
    updated: "2d " + t("ago"),
    level: t("All"),
    videoUrl: "https://youtu.be/Xej22GsLLQA",
    summary: t(
      "Complete guide to drip irrigation system with layout animation showing how it works for efficient water management."
    ),
  },
  {
    id: "vid-2",
    title: t("Video: Best Drip Irrigation System for Gardens & Farms"),
    category: t("Irrigation"),
    type: "Video",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Irrigation methods"),
    tags: [t("Water"), t("Crops")],
    timeToRead: "12 " + t("min"),
    views: 2850,
    updated: "1d " + t("ago"),
    level: t("Beginner"),
    videoUrl: "https://youtu.be/HEyFQo9RUWQ",
    summary: t(
      "Learn about the best drip irrigation systems suitable for gardens and agriculture farms."
    ),
  },
  {
    id: "vid-3",
    title: t("Video: Importance of Organic Farming - Sustainable Agriculture"),
    category: t("Organic Farming"),
    type: "Video",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Sustainability"),
    tags: [t("Organic"), t("Crops")],
    timeToRead: "18 " + t("min"),
    views: 2240,
    updated: "3d " + t("ago"),
    level: t("Beginner"),
    videoUrl: "https://youtu.be/lRyXlvIJFWI",
    summary: t(
      "Understand what organic farming is and why it's important for sustainable agriculture."
    ),
  },
  {
    id: "vid-4",
    title: t("Video: 30 Essential Organic Farming Techniques"),
    category: t("Organic Farming"),
    type: "Video",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Organic methods"),
    tags: [t("Organic"), t("Crops")],
    timeToRead: "20 " + t("min"),
    views: 1890,
    updated: "4d " + t("ago"),
    level: t("Intermediate"),
    videoUrl: "https://youtu.be/mkEsLdNKlPM",
    summary: t(
      "30 essential organic farming techniques for small farms and market gardens."
    ),
  },
  {
    id: "vid-5",
    title: t("Video: How to Start Organic Farming Business"),
    category: t("Organic Farming"),
    type: "Video",
    crop: "Multi-crop",
    season: "All",
    region: "Pan India",
    problem: t("Business setup"),
    tags: [t("Organic"), t("Crops")],
    timeToRead: "14 " + t("min"),
    views: 2650,
    updated: "2d " + t("ago"),
    level: t("Beginner"),
    videoUrl: "https://youtu.be/_AM2fX24vtQ",
    summary: t(
      "Step-by-step guide on how to start organic farming business and organic production process."
    ),
  },

  // Guides
  {
    id: "guide-1",
    title: t("Drip Irrigation Setup for Tomatoes"),
    category: t("Irrigation"),
    type: t("GUIDE"),
    crop: "Tomato",
    season: "Rabi",
    region: "Karnataka",
    problem: t("Water stress"),
    tags: [t("Water"), t("Crops")],
    timeToRead: "6 " + t("min"),
    views: 1412,
    updated: "5d " + t("ago"),
    level: t("Beginner"),
    summary:
      "AI summary: Lay mainline and laterals with 30 cm spacing; flush weekly; target 1.2-1.5 lph emitters for uniform flow.",
  },
  {
    id: "guide-2",
    title: t("Climate-Smart Sowing Window for Maize"),
    category: "Weather & Climate",
    type: t("GUIDE"),
    crop: "Maize",
    season: "Kharif",
    region: "MP",
    problem: t("Rainfall uncertainty"),
    tags: [t("Weather"), t("Crops")],
    timeToRead: "9 " + t("min"),
    views: 1250,
    updated: "3d " + t("ago"),
    level: t("Intermediate"),
    summary:
      "AI summary: Target sowing after 35mm cumulative rain; choose 90-105 day hybrids; use seed treatment + moisture mulching.",
  },

  // Crop Cultivation Guides
  {
    id: "crop-guide-1",
    title: t("Maize Crop Tutorial: Sowing to Harvest"),
    category: t("Crop Cultivation"),
    type: "Tutorial",
    crop: "Maize",
    season: "Kharif",
    region: "MP",
    problem: t("General management"),
    tags: [t("Crops"), t("Weather")],
    timeToRead: "15 " + t("min"),
    views: 2760,
    updated: "4d " + t("ago"),
    level: t("Beginner"),
    summary: t(
      "Full walkthrough on maize prep, sowing, irrigation, fertilization, and harvest timing."
    ),
  },
  {
    id: "crop-guide-2",
    title: t("Cotton Cultivation: Complete Season Guide"),
    category: t("Crop Cultivation"),
    type: "Tutorial",
    crop: "Cotton",
    season: "Kharif",
    region: "Maharashtra",
    problem: t("General management"),
    tags: [t("Crops")],
    timeToRead: "18 " + t("min"),
    views: 2340,
    updated: "6d " + t("ago"),
    level: t("Intermediate"),
    summary: t(
      "Land preparation, Bt vs non-Bt varieties, spacing, drip setup, pest monitoring calendar, picking stages, and post-harvest handling."
    ),
  },
  {
    id: "crop-guide-3",
    title: t("Vegetable Farming: Tomato Production Guide"),
    category: t("Crop Cultivation"),
    type: "Tutorial",
    crop: "Tomato",
    season: "All",
    region: "Pan India",
    problem: t("General management"),
    tags: [t("Crops"), t("Water")],
    timeToRead: "14 " + t("min"),
    views: 3120,
    updated: "2d " + t("ago"),
    level: t("Beginner"),
    summary: t(
      "Nursery raising, transplanting, staking, drip irrigation, fertigation schedule, disease management, and grading for market."
    ),
  },
];

const createTrendingTopics = (t) => [
  t("Pink bollworm control"),
  t("Drip design for tomatoes"),
  t("Paddy MSP updates"),
  t("Soil Health Card tips"),
  t("Maize sowing window"),
  t("Organic pest control"),
  t("Pesticide safety guidelines"),
  t("Vermicomposting techniques"),
];

const createLearningPaths = (t) => [
  {
    title: "Crop Protection",
    steps: [
      t("Beginner") + ": Scouting basics",
      t("Intermediate") + ": IPM kits",
      t("Advanced") + ": Bio-control integration",
    ],
  },
  {
    title: "Irrigation & Water",
    steps: [
      t("Beginner") + ": Scheduling",
      t("Intermediate") + ": Drip design",
      t("Advanced") + ": Automation",
    ],
  },
  {
    title: "Market Readiness",
    steps: [
      t("Beginner") + ": Grading",
      t("Intermediate") + ": MSP & FPO",
      t("Advanced") + ": Contracts",
    ],
  },
];

const videoTutorials = [
  {
    id: "vid-1",
    title: "Tomato Drip Layout in 6 Minutes",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "6:12",
    tags: ["Water", "Crops"],
  },
  {
    id: "vid-2",
    title: "Scouting for Fall Armyworm",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "4:28",
    tags: ["Pests", "Crops"],
  },
];

const createExpertQA = (t) => [
  {
    q: "My cotton leaves are curling—what should I check first?",
    a: "Inspect for jassids under leaves, check soil moisture. If jassids >2/leaf, spray neem (1500 ppm) followed by selective insecticide after 5-7 days if needed.",
  },
  {
    q: "How often should I flush my drip lines?",
    a: "Once a week; use venturi with acid flush monthly if water EC >1.2. Keep filters at <5 psi differential.",
  },
];

const schemes = [];

const createPestLibrary = (t) => [
  {
    name: "Fall Armyworm",
    crop: "Maize",
    symptoms: "Window-pane leaves, shot holes on whorl",
    solution: "Pheromone traps, neem sprays, spinosad at ETL.",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Aphids",
    crop: "Vegetables",
    symptoms: "Sticky honeydew, curled leaves",
    solution: "Yellow sticky traps, soap sprays, parasitoids.",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=60",
  },
];

const createCultivationSteps = (t) => [
  {
    title: t("Sowing"),
    detail: "Use treated seed; ensure moisture at 60-70%.",
  },
  {
    title: t("Irrigation"),
    detail: "Follow soil-moisture-based scheduling; avoid waterlogging.",
  },
  {
    title: t("Fertilization"),
    detail: "Split N 3 times; add micronutrients as per soil test.",
  },
  {
    title: t("Pest & Disease"),
    detail: "Scout weekly; integrate bio and chemical controls.",
  },
  {
    title: t("Harvesting"),
    detail: "Harvest at physiological maturity; handle gently.",
  },
];

const downloads = [
  { title: "Farming Guide (PDF)", size: "1.2 MB" },
  { title: "Soil Test Instructions (PDF)", size: "850 KB" },
];

const tagPalette = {
  Weather: "bg-blue-100 text-blue-800",
  Market: "bg-amber-100 text-amber-800",
  Crops: "bg-emerald-100 text-emerald-800",
  Pests: "bg-rose-100 text-rose-800",
  Water: "bg-cyan-100 text-cyan-800",
  Organic: "bg-green-100 text-green-800",
  Safety: "bg-red-100 text-red-800",
  Technology: "bg-purple-100 text-purple-800",
};

const createCategories = (t) => [
  t("All"),
  t("Articles"),
  t("Videos"),
  t("Guides"),
  t("Organic Farming"),
  t("Pesticide Guidelines"),
  t("Crop Cultivation"),
];

const categoryMatchers = (categories) => ({
  [categories[0]]: () => true,
  [categories[1]]: (item) => item.type?.toLowerCase() === "article",
  [categories[2]]: (item) => item.type?.toLowerCase() === "video",
  [categories[3]]: (item) => item.type?.toLowerCase() === "guide",
  [categories[4]]: (item) => item.category?.toLowerCase().includes("organic"),
  [categories[5]]: (item) => item.category?.toLowerCase().includes("pesticide"),
  [categories[6]]: (item) =>
    item.category?.toLowerCase().includes("crop cultivation") ||
    item.type?.toLowerCase().includes("tutorial"),
});

const KnowledgeHub = () => {
  const { t } = useLanguage();

  // Initialize translated data
  const knowledgeItems = useMemo(() => createKnowledgeItems(t), [t]);
  const trendingTopics = useMemo(() => createTrendingTopics(t), [t]);
  const learningPaths = useMemo(() => createLearningPaths(t), [t]);
  const expertQA = useMemo(() => createExpertQA(t), [t]);
  const pestLibrary = useMemo(() => createPestLibrary(t), [t]);
  const cultivationSteps = useMemo(() => createCultivationSteps(t), [t]);
  const categories = useMemo(() => createCategories(t), [t]);
  const matchers = useMemo(() => categoryMatchers(categories), [categories]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [filters, setFilters] = useState({
    crop: "",
    season: "",
    region: "",
    problem: "",
  });
  const [favorites, setFavorites] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(6);
  const [fontScale, setFontScale] = useState(100);
  const [dark, setDark] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Set default selected category when categories change
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const contentRef = useRef(null);

  const filtered = useMemo(() => {
    if (!categories.length || !selectedCategory) return [];
    const matcher = matchers[selectedCategory] || matchers[categories[0]];
    const q = search.trim().toLowerCase();
    const tagQuery = selectedTag.trim().toLowerCase();

    return knowledgeItems.filter((item) => {
      const itemCategory = (item.category || "").toLowerCase();
      const itemType = (item.type || "").toLowerCase();
      const itemCrop = (item.crop || "").toLowerCase();
      const itemSeason = (item.season || "").toLowerCase();
      const itemRegion = (item.region || "").toLowerCase();
      const itemProblem = (item.problem || "").toLowerCase();
      const itemTitle = (item.title || "").toLowerCase();
      const itemSummary = (item.summary || "").toLowerCase();
      const itemTags = (item.tags || []).map((t) => t.toLowerCase());

      if (!matcher({ ...item, category: itemCategory, type: itemType })) {
        return false;
      }

      if (
        (filters.crop && !itemCrop.includes(filters.crop.toLowerCase())) ||
        (filters.season &&
          !itemSeason.includes(filters.season.toLowerCase())) ||
        (filters.region &&
          !itemRegion.includes(filters.region.toLowerCase())) ||
        (filters.problem &&
          !itemProblem.includes(filters.problem.toLowerCase()))
      ) {
        return false;
      }

      if (tagQuery && !itemTags.some((t) => t.includes(tagQuery))) {
        return false;
      }

      if (
        q &&
        !(
          itemTitle.includes(q) ||
          itemSummary.includes(q) ||
          itemTags.some((t) => t.includes(q))
        )
      ) {
        return false;
      }

      return true;
    });
  }, [
    search,
    selectedCategory,
    selectedTag,
    filters,
    knowledgeItems,
    matchers,
    categories,
  ]);

  useEffect(() => {
    setIsFiltering(false);
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [filtered]);

  const visible = filtered.slice(0, itemsToShow);
  const emptyState = filtered.length === 0;

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ fontSize: `${fontScale}%` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="glass-card rounded-card p-6 animate-fadeIn">
            <p className="text-sm uppercase tracking-wide text-gradient font-semibold mb-1">
              {t("KNOWLEDGE HUB")}
            </p>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              {t("Grow smarter every week")}
            </h1>
            <p className="text-text-secondary">
              {t(
                "Curated articles, guides, videos, and scheme updates for farmers, updated weekly."
              )}
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-[280px,1fr] gap-6 items-start">
          {/* Sidebar */}
          <aside
            className="glass-card rounded-card p-4 sticky top-24 sidebar-scroll"
            role="navigation"
            aria-label="Knowledge categories"
          >
            <h3 className="text-lg font-semibold mb-3 text-white">
              {t("Categories")}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setIsFiltering(true);
                    setSelectedCategory(cat);
                    setItemsToShow(6);
                    setSelectedTag("");
                  }}
                  aria-pressed={selectedCategory === cat}
                  className={`px-4 py-2 rounded-button text-sm font-semibold transition-all duration-250 hover:scale-103 focus:outline-none ${
                    selectedCategory === cat
                      ? "bg-gradient-primary text-white shadow-glow-purple"
                      : "glass-card text-white hover:bg-gradient-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h4 className="text-sm font-semibold text-white mb-2">
              {t("Filters")}
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder={t("Crop")}
                value={filters.crop}
                onChange={(e) => {
                  setIsFiltering(true);
                  handleFilterChange("crop", e.target.value);
                  setItemsToShow(6);
                }}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Season")}
                value={filters.season}
                onChange={(e) => {
                  setIsFiltering(true);
                  handleFilterChange("season", e.target.value);
                  setItemsToShow(6);
                }}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Region")}
                value={filters.region}
                onChange={(e) => {
                  setIsFiltering(true);
                  handleFilterChange("region", e.target.value);
                  setItemsToShow(6);
                }}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Problem")}
                value={filters.problem}
                onChange={(e) => {
                  setIsFiltering(true);
                  handleFilterChange("problem", e.target.value);
                  setItemsToShow(6);
                }}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(tagPalette).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setIsFiltering(true);
                      setSelectedTag((prev) => (prev === tag ? "" : tag));
                      setItemsToShow(6);
                    }}
                    aria-pressed={selectedTag === tag}
                    className={`px-3 py-1 rounded-button text-xs font-semibold transition-all duration-250 focus:outline-none hover:scale-105 ${
                      selectedTag === tag
                        ? "bg-gradient-primary text-white shadow-glow-purple"
                        : "glass-card text-white hover:bg-gradient-primary"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-8">
            {/* Search & trending */}
            <div className="glass-card rounded-card p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 glass-input rounded-button w-full lg:w-2/3">
                  <FaSearch className="text-text-secondary" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setIsFiltering(true);
                      setSearch(e.target.value);
                      setItemsToShow(6);
                    }}
                    placeholder={t("Search articles, videos, guides")}
                    className="bg-transparent w-full outline-none text-white"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setIsFiltering(true);
                        setSearch(topic);
                        setItemsToShow(6);
                      }}
                      className="px-3 py-1 rounded-button text-sm glass-card text-white hover:bg-gradient-primary transition-all duration-250"
                    >
                      #{topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content cards */}
            <div className="glass-card rounded-card p-4" ref={contentRef}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {t("Content Feed")}
                </h2>
                <span className="text-sm text-text-secondary">
                  {filtered.length} {t("items")}
                </span>
              </div>

              {isFiltering ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[...Array(4)].map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-card p-4 glass-card animate-pulse"
                    >
                      <div className="h-4 w-16 bg-glass-light rounded mb-3" />
                      <div className="h-5 w-3/4 bg-glass-light rounded mb-2" />
                      <div className="h-4 w-full bg-glass-light rounded mb-2" />
                      <div className="h-4 w-5/6 bg-glass-light rounded" />
                    </div>
                  ))}
                </div>
              ) : emptyState ? (
                <div className="text-center py-10">
                  <div className="text-6xl mb-3">🌱</div>
                  <h3 className="text-lg font-semibold text-white">
                    {t("No content found")}
                  </h3>
                  <p className="text-text-secondary">
                    {t("Try adjusting filters or search keywords.")}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {visible.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="rounded-card p-4 glass-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 hover:scale-[1.02] group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase text-gradient font-semibold">
                            {item.type}
                          </p>
                          <h3 className="text-lg font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-text-secondary mt-1 group-hover:text-white">
                            {item.summary}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="text-gradient hover:opacity-80 transition-all duration-250"
                          aria-label="Save to favorites"
                        >
                          {favorites.includes(item.id) ? (
                            <FaBookmark />
                          ) : (
                            <FaRegBookmark />
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-white">
                        <span className="inline-flex items-center gap-1">
                          <FaEye /> {item.views}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FaClock /> {item.timeToRead}
                        </span>
                        <span className="px-2 py-1 glass-card rounded-button text-xs">
                          {t("Last updated")} {item.updated}
                        </span>
                        <span className="px-2 py-1 bg-gradient-primary rounded-button text-xs font-medium">
                          {item.level}
                        </span>
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 glass-card rounded-button text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {!isFiltering && visible.length < filtered.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setItemsToShow((v) => v + 4)}
                    className="px-6 py-3 bg-gradient-primary text-white rounded-button hover:scale-105 font-medium shadow-glow-purple transition-all duration-250"
                  >
                    {t("Load more")}
                  </button>
                </div>
              )}
            </div>

            {/* Learning paths */}
            {(selectedCategory === categories[0] ||
              selectedCategory === categories[2] ||
              selectedCategory === categories[4]) && (
              <div className="glass-card rounded-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaGraduationCap className="text-gradient" />
                  <h2 className="text-xl font-semibold text-white">
                    {t("Recommended Paths")}
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {learningPaths.map((path) => (
                    <div
                      key={path.title}
                      className="rounded-card glass-card p-4 hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group"
                    >
                      <h3 className="font-semibold text-white mb-2">
                        {path.title}
                      </h3>
                      <ol className="space-y-2 text-sm text-text-secondary group-hover:text-white">
                        {path.steps.map((step, idx) => (
                          <li key={step} className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-full bg-gradient-primary text-white text-xs flex items-center justify-center font-semibold">
                              {idx + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expert Q&A */}
            {(selectedCategory === categories[0] ||
              selectedCategory === categories[2] ||
              selectedCategory === categories[1]) && (
              <div className="glass-card rounded-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaStar className="text-gradient" />
                  <h2 className="text-xl font-semibold text-white">
                    {t("Expert Q&A")}
                  </h2>
                </div>
                <div className="space-y-3">
                  {expertQA.map((qa, idx) => (
                    <div
                      key={idx}
                      className="glass-card rounded-card p-4 hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group"
                    >
                      <p className="font-semibold text-white">Q: {qa.q}</p>
                      <p className="text-text-secondary mt-1 group-hover:text-white">
                        A: {qa.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pest library */}
            {(selectedCategory === categories[0] ||
              selectedCategory === categories[4] ||
              selectedCategory === categories[1]) && (
              <div className="glass-card rounded-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaBug className="text-gradient" />
                  <h2 className="text-xl font-semibold text-white">
                    {t("Pest & Disease Library")}
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {pestLibrary.map((pest) => (
                    <div
                      key={pest.name}
                      className="rounded-card overflow-hidden glass-card hover:shadow-glow-purple transition-all duration-250"
                    >
                      <img
                        src={pest.img}
                        alt={pest.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">
                            {pest.name}
                          </h3>
                          <span className="text-sm text-text-secondary">
                            {pest.crop}
                          </span>
                        </div>
                        <p className="text-text-secondary mt-1">
                          {t("Symptoms")}: {pest.symptoms}
                        </p>
                        <p className="text-text-secondary">
                          {t("Solutions")}: {pest.solution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-step guides */}
            {(selectedCategory === categories[0] ||
              selectedCategory === categories[4] ||
              selectedCategory === categories[2]) && (
              <div className="glass-card rounded-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaTractor className="text-gradient" />
                  <h2 className="text-xl font-semibold text-white">
                    {t("Step-by-Step Cultivation")}
                  </h2>
                </div>
                <div className="grid gap-3 md:grid-cols-5">
                  {cultivationSteps.map((step, idx) => (
                    <div
                      key={step.title}
                      className="glass-card rounded-card p-4 hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 text-sm group"
                    >
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-primary text-white font-semibold mb-2">
                        {idx + 1}
                      </span>
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="text-text-secondary mt-1 group-hover:text-white">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related articles placeholder */}
            <div className="glass-card rounded-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <FaArrowRight className="text-gradient" />
                <h2 className="text-xl font-semibold text-white">
                  {t("Related Articles")}
                </h2>
              </div>
              <p className="text-text-secondary text-sm">
                {t(
                  "Explore more on weather, markets, crops, pests, and government schemes tailored to your filters."
                )}
              </p>
            </div>
          </section>
        </div>

        {/* Content Detail Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="glass-card rounded-card max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl"
              >
                ×
              </button>

              <div className="mb-4">
                <p className="text-xs uppercase text-gradient font-semibold mb-1">
                  {selectedItem.type} • {selectedItem.category}
                </p>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedItem.title}
                </h2>
                <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <FaClock /> {selectedItem.timeToRead}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye /> {selectedItem.views} views
                  </span>
                  <span>{selectedItem.level}</span>
                  <span>{selectedItem.crop}</span>
                  <span>{selectedItem.region}</span>
                </div>
              </div>

              {/* Video Player for Video type */}
              {selectedItem.type?.toLowerCase() === "video" &&
                selectedItem.videoUrl && (
                  <div className="mb-6">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                        <FaPlay className="text-6xl text-white mb-4 opacity-80" />
                        <p className="text-white text-lg mb-4">
                          Watch this video on YouTube
                        </p>
                        <a
                          href={selectedItem.videoUrl.replace(
                            "/embed/",
                            "/watch?v="
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-button font-semibold transition-all duration-250 flex items-center gap-2"
                        >
                          <FaPlay /> Open in YouTube
                        </a>
                        <p className="text-text-secondary text-sm mt-4">
                          Some videos cannot be embedded. Click above to watch
                          on YouTube.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Article Content */}
              {selectedItem.content && (
                <div className="prose prose-invert max-w-none">
                  <div className="text-white whitespace-pre-line">
                    {selectedItem.content}
                  </div>
                </div>
              )}

              {/* Summary if no detailed content */}
              {!selectedItem.content && selectedItem.summary && (
                <div className="text-text-secondary">
                  <p>{selectedItem.summary}</p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedItem.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 glass-card rounded-button text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeHub;
