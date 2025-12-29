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
  },
  {
    id: "art-2",
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
    id: "art-3",
    title: t("Market Outlook: Paddy MSP & Local Demand"),
    category: t("Market Insights"),
    type: "Insight",
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
    id: "art-4",
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
    id: "art-5",
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
  {
    id: "vid-article-1",
    title: t("Video: Drip Layout Walkthrough"),
    category: t("Irrigation"),
    type: "Video",
    crop: "Tomato",
    season: "Rabi",
    region: "Karnataka",
    problem: t("Water stress"),
    tags: [t("Water"), t("Crops")],
    timeToRead: "Video",
    views: 980,
    updated: "2d " + t("ago"),
    level: t("All"),
    summary: t(
      "Short explainer on drip component placement and flushing routine."
    ),
  },
  {
    id: "tut-1",
    title: t("Maize Crop Tutorial: Sowing to Harvest"),
    category: t("Crop Tutorials"),
    type: "Tutorial",
    crop: "Maize",
    season: "Kharif",
    region: "MP",
    problem: t("General management"),
    tags: [t("Crops"), t("Weather")],
    timeToRead: "Tutorial",
    views: 760,
    updated: "4d " + t("ago"),
    level: t("Beginner"),
    summary: t(
      "Full walkthrough on maize prep, sowing, irrigation, fertilization, and harvest timing."
    ),
  },
];

const createTrendingTopics = (t) => [
  t("Pink bollworm control"),
  t("Drip design for tomatoes"),
  t("Paddy MSP updates"),
  t("Soil Health Card tips"),
  t("Maize sowing window"),
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
};

const createCategories = (t) => [
  t("All"),
  t("Articles"),
  t("Guides"),
  t("Videos"),
  t("Crop Tutorials"),
  t("Market Insights"),
];

const categoryMatchers = (categories) => ({
  [categories[0]]: () => true,
  [categories[1]]: (item) => item.type?.toLowerCase() === "article",
  [categories[2]]: (item) => item.type?.toLowerCase() === "guide",
  [categories[3]]: (item) =>
    item.type?.toLowerCase() === "video" ||
    item.type?.toLowerCase() === "tutorial",
  [categories[4]]: (item) =>
    item.category?.toLowerCase().includes("crop") ||
    item.type?.toLowerCase().includes("tutorial"),
  [categories[5]]: (item) =>
    item.category?.toLowerCase().includes("market") ||
    item.type?.toLowerCase().includes("insight"),
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
                      className="rounded-card p-4 glass-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 hover:scale-[1.02] group"
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
      </div>
    </div>
  );
};

export default KnowledgeHub;
