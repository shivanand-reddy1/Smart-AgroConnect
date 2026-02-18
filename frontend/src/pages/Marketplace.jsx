import React, { useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const products = [
  {
    id: "seed-1",
    title: "Hybrid Maize Seeds (110-120 days)",
    category: "Seeds",
    crop: "Maize",
    brand: "AgriPrime",
    price: 1850,
    unit: "20kg bag",
    stock: "In stock",
    qualityGrade: "Certified",
    organic: false,
    delivery: ["Home", "Pickup"],
    region: "Maharashtra",
    seller: "Kisan Seeds Co.",
    rating: 4.6,
    reviews: 128,
    badges: ["Verified seller", "Lab-tested"],
    moq: "2 bags",
    images: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=60",
    ],
    description:
      "High-germination hybrid suited for Kharif with good standability.",
  },
  {
    id: "fert-1",
    title: "NPK 10:26:26 Fertilizer",
    category: "Fertilizers",
    crop: "Paddy",
    brand: "Nutrimax",
    price: 1325,
    unit: "50kg bag",
    stock: "In stock",
    qualityGrade: "A",
    organic: false,
    delivery: ["Home"],
    region: "Telangana",
    seller: "AgroMart",
    rating: 4.4,
    reviews: 96,
    badges: ["Verified seller"],
    moq: "1 bag",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=60",
    ],
    description:
      "Balanced starter dose for paddy with assured nutrient release.",
  },
  {
    id: "pest-1",
    title: "Bio Pesticide - Neem Extract 1500 ppm",
    category: "Pesticides",
    crop: "Multi-crop",
    brand: "GreenShield",
    price: 520,
    unit: "1L",
    stock: "In stock",
    qualityGrade: "Organic",
    organic: true,
    delivery: ["Home", "Pickup"],
    region: "Karnataka",
    seller: "EcoFarm Inputs",
    rating: 4.7,
    reviews: 74,
    badges: ["Certified Organic", "Verified seller"],
    moq: "2 bottles",
    images: [
      "https://images.unsplash.com/photo-1441123694162-e54a981ceba3?auto=format&fit=crop&w=400&q=60",
    ],
    description:
      "Broad-spectrum bio-control, safe on beneficial insects when used as directed.",
  },
  {
    id: "tool-1",
    title: "Stainless Steel Hoe + Weeder Kit",
    category: "Tools",
    crop: "Vegetables",
    brand: "FieldPro",
    price: 1450,
    unit: "kit",
    stock: "Limited",
    qualityGrade: "A",
    organic: false,
    delivery: ["Home"],
    region: "MP",
    seller: "Rural Tools Hub",
    rating: 4.3,
    reviews: 52,
    badges: ["Verified seller"],
    moq: "1 kit",
    images: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=60",
    ],
    description: "Ergonomic hand tools for small plots and kitchen gardens.",
  },
  {
    id: "machine-1",
    title: "Mini Power Tiller 7HP with Warranty",
    category: "Machines",
    crop: "Multi-crop",
    brand: "AgroMech",
    price: 78000,
    unit: "unit",
    stock: "Pre-order",
    qualityGrade: "OEM",
    organic: false,
    delivery: ["Home"],
    region: "Gujarat",
    seller: "Mechanize Agro",
    rating: 4.5,
    reviews: 33,
    badges: ["Verified seller", "Warranty"],
    moq: "1",
    images: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=60",
    ],
    description:
      "Fuel-efficient tiller with rotary blades; includes 1-year on-site warranty.",
  },
  {
    id: "irrig-1",
    title: "Drip Irrigation Starter Kit (0.5 acre)",
    category: "Irrigation",
    crop: "Tomato",
    brand: "DripSmart",
    price: 12500,
    unit: "kit",
    stock: "In stock",
    qualityGrade: "A",
    organic: false,
    delivery: ["Home", "Pickup"],
    region: "Karnataka",
    seller: "Irritech",
    rating: 4.6,
    reviews: 58,
    badges: ["Verified seller"],
    moq: "1 kit",
    images: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=60",
    ],
    description:
      "Complete drip set with laterals, filters, venturi, and fittings for 0.5 acre.",
  },
  {
    id: "crop-1",
    title: "Fresh Turmeric Fingers - Grade A",
    category: "Crops",
    crop: "Turmeric",
    brand: "FarmGate",
    price: 12500,
    unit: "quintal",
    stock: "Ready to ship",
    qualityGrade: "A",
    organic: true,
    delivery: ["Pickup", "Home"],
    region: "Hassan",
    seller: "SowGrow Farms",
    rating: 4.8,
    reviews: 61,
    badges: ["Verified seller", "Organic"],
    moq: "2 quintals",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=60",
    ],
    description:
      "Curcumin-rich turmeric, cleaned and sorted, moisture within spec.",
  },
  {
    id: "organic-1",
    title: "Vermicompost - Sieved",
    category: "Organic Products",
    crop: "Multi-crop",
    brand: "BioGrow",
    price: 14,
    unit: "kg (min 200 kg)",
    stock: "In stock",
    qualityGrade: "Organic",
    organic: true,
    delivery: ["Home"],
    region: "UP",
    seller: "EarthCare Organics",
    rating: 4.5,
    reviews: 89,
    badges: ["Certified Organic", "Verified seller"],
    moq: "200 kg",
    images: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=60",
    ],
    description:
      "Moisture-balanced vermicompost, ideal for vegetables and orchards.",
  },
];

const categories = [
  "All",
  "Seeds",
  "Fertilizers",
  "Pesticides",
  "Tools",
  "Machines",
  "Irrigation",
  "Crops",
  "Organic Products",
];

const deliveryOptions = ["Home", "Pickup"];

const Marketplace = () => {
  const { t } = useLanguage();

  const categories = [
    t("All"),
    t("Seeds"),
    t("Fertilizers"),
    t("Pesticides"),
    t("Tools"),
    t("Machines"),
    t("Irrigation"),
    t("Crops"),
    t("Organic Products"),
  ];

  const deliveryOptions = [t("Home"), t("Pickup")];

  const [selectedCategory, setSelectedCategory] = useState(t("All"));
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    crop: "",
    region: "",
    brand: "",
    organic: "",
    delivery: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });
  const [compare, setCompare] = useState([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory)
        return false;

      if (q) {
        const hay =
          `${item.title} ${item.crop} ${item.brand} ${item.category} ${item.region}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (
        filters.crop &&
        !item.crop.toLowerCase().includes(filters.crop.toLowerCase())
      )
        return false;
      if (
        filters.region &&
        !item.region.toLowerCase().includes(filters.region.toLowerCase())
      )
        return false;
      if (
        filters.brand &&
        !item.brand.toLowerCase().includes(filters.brand.toLowerCase())
      )
        return false;
      if (filters.delivery && !item.delivery.includes(filters.delivery))
        return false;
      if (filters.organic === "organic" && !item.organic) return false;
      if (filters.organic === "non" && item.organic) return false;

      if (filters.rating) {
        const minRating = Number(filters.rating);
        if (Number(item.rating || 0) < minRating) return false;
      }

      if (filters.minPrice && Number(item.price) < Number(filters.minPrice))
        return false;
      if (filters.maxPrice && Number(item.price) > Number(filters.maxPrice))
        return false;

      return true;
    });
  }, [search, selectedCategory, filters]);

  const toggleCompare = (id) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // cap at 3
      return [...prev, id];
    });
  };

  const compareItems = products.filter((p) => compare.includes(p.id));

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-card rounded-card shadow-glow-gradient p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-purple-400 font-semibold">
              {t("Marketplace")}
            </p>
            <h1 className="text-3xl font-bold text-white">
              {t("Shop trusted agri inputs and produce")}
            </h1>
            <p className="text-gray-300 mt-1 max-w-2xl">
              {t(
                "Compare certified inputs, contact verified sellers, and order with delivery clarity—without leaving AI Smart AgroConnect.",
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 glass-card rounded-card flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">
                {t("Trust")}
              </span>
              <span className="text-sm text-white">
                {t("Verified sellers, badges, and reviews")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px,1fr] gap-6 items-start">
          {/* Filters */}
          <aside className="glass-card rounded-card p-4 sticky top-24">
            <h3 className="text-lg font-semibold mb-3 text-white">
              {t("Categories")}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-3 py-2 rounded-button text-sm transition-all duration-250 hover:scale-105 ${
                    selectedCategory === cat
                      ? "bg-gradient-primary text-white shadow-glow-purple"
                      : "glass-card text-white hover:bg-gradient-primary hover:shadow-glow-purple"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder={t("Search products, crops, brands")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Crop")}
                value={filters.crop}
                onChange={(e) => handleFilter("crop", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Region/state")}
                value={filters.region}
                onChange={(e) => handleFilter("region", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Brand")}
                value={filters.brand}
                onChange={(e) => handleFilter("brand", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={t("Min price")}
                  value={filters.minPrice}
                  onChange={(e) => handleFilter("minPrice", e.target.value)}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
                />
                <input
                  type="number"
                  placeholder={t("Max price")}
                  value={filters.maxPrice}
                  onChange={(e) => handleFilter("maxPrice", e.target.value)}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
                />
              </div>
              <select
                value={filters.delivery}
                onChange={(e) => handleFilter("delivery", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              >
                <option value="" className="bg-gray-800">
                  {t("Delivery type")}
                </option>
                {deliveryOptions.map((d) => (
                  <option key={d} value={d} className="bg-gray-800">
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={filters.organic}
                onChange={(e) => handleFilter("organic", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              >
                <option value="" className="bg-gray-800">
                  {t("Organic / Non-organic")}
                </option>
                <option value="organic" className="bg-gray-800">
                  {t("Organic")}
                </option>
                <option value="non" className="bg-gray-800">
                  {t("Non-organic")}
                </option>
              </select>
              <select
                value={filters.rating}
                onChange={(e) => handleFilter("rating", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              >
                <option value="" className="bg-gray-800">
                  {t("Min rating")}
                </option>
                <option value="4.5" className="bg-gray-800">
                  4.5+
                </option>
                <option value="4.0" className="bg-gray-800">
                  4.0+
                </option>
                <option value="3.5" className="bg-gray-800">
                  3.5+
                </option>
              </select>
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            <div className="glass-card rounded-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {t("Product Feed")}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {filtered.length} {t("items")}
                  </p>
                </div>
                {compare.length > 0 && (
                  <span className="text-sm text-purple-400 font-semibold">
                    {compare.length} {t("selected for comparison (max 3)")}
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className="glass-card rounded-card p-4 hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs uppercase text-purple-400 group-hover:!text-white font-semibold transition-colors">
                          {item.category}
                        </p>
                        <h3 className="text-lg font-semibold text-white leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                          {t("Crop:")} {item.crop}
                        </p>
                      </div>
                      <label className="text-xs text-gray-400 group-hover:!text-white flex items-center gap-1 transition-colors">
                        <input
                          type="checkbox"
                          checked={compare.includes(item.id)}
                          onChange={() => toggleCompare(item.id)}
                          className="accent-purple-600"
                        />
                        {t("Compare")}
                      </label>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-white">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                        / {item.unit}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 group-hover:!text-white mb-2 transition-colors">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs mb-3">
                      <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-button group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors">
                        {t(item.stock)}
                      </span>
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-button group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors">
                        {item.qualityGrade}
                      </span>
                      {item.organic && (
                        <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-button group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors">
                          {t("Organic")}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-button group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors">
                        {item.region}
                      </span>
                      <span className="px-2 py-1 bg-purple-500 bg-opacity-20 text-purple-400 rounded-button group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors">
                        {item.brand}
                      </span>
                      {item.delivery.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-1 bg-orange-500 bg-opacity-20 text-orange-400 rounded-button group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors"
                        >
                          {t(d)}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {item.seller}
                        </span>
                        {item.badges.includes("Verified seller") && (
                          <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-button text-xs group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors">
                            {t("Verified")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400 font-semibold group-hover:!text-white transition-colors">
                        ★ {item.rating}
                        <span className="text-gray-400 text-xs group-hover:!text-white transition-colors">
                          ({item.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs mb-3 flex-wrap">
                      {item.badges
                        .filter((b) => b !== "Verified seller")
                        .map((b) => (
                          <span
                            key={b}
                            className="px-2 py-1 rounded-button bg-gray-700 text-gray-300 group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors"
                          >
                            {b}
                          </span>
                        ))}
                      <span className="px-2 py-1 rounded-button bg-gray-700 text-gray-300 group-hover:!bg-white group-hover:!bg-opacity-20 group-hover:!text-white transition-colors">
                        {t("MOQ:")} {item.moq}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {compareItems.length > 0 && (
              <div className="glass-card rounded-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {t("Comparison")}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {t("Select up to 3 items")}
                  </span>
                </div>
                <div className="overflow-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-800 text-gray-300">
                      <tr>
                        <th className="px-3 py-2">{t("Item")}</th>
                        <th className="px-3 py-2">{t("Price")}</th>
                        <th className="px-3 py-2">{t("Delivery")}</th>
                        <th className="px-3 py-2">{t("Stock")}</th>
                        <th className="px-3 py-2">{t("Rating")}</th>
                        <th className="px-3 py-2">{t("Badges")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareItems.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-gray-700 last:border-0"
                        >
                          <td className="px-3 py-2 font-semibold text-white">
                            {c.title}
                          </td>
                          <td className="px-3 py-2 text-white">
                            ₹{c.price} / {c.unit}
                          </td>
                          <td className="px-3 py-2 text-gray-300">
                            {c.delivery.join(", ")}
                          </td>
                          <td className="px-3 py-2 text-gray-300">{c.stock}</td>
                          <td className="px-3 py-2 text-yellow-400">
                            ★ {c.rating}
                          </td>
                          <td className="px-3 py-2 text-gray-300">
                            {c.badges.join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card rounded-card p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {t("Buyer workflow")}
                </h3>
                <ol className="space-y-1 text-sm text-gray-300">
                  <li>
                    1) {t("Search & filter by crop, region, price, delivery.")}
                  </li>
                  <li>
                    2) {t("Compare up to 3 items and open product details.")}
                  </li>
                  <li>3) {t("Contact seller via in-platform messaging.")}</li>
                  <li>
                    4){" "}
                    {t(
                      "Place order with quantity, delivery, and payment preferences.",
                    )}
                  </li>
                  <li>5) {t("Track order status and receive updates.")}</li>
                </ol>
              </div>
              <div className="glass-card rounded-card p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {t("Seller workflow")}
                </h3>
                <ol className="space-y-1 text-sm text-gray-300">
                  <li>
                    1){" "}
                    {t("List product with price, stock, delivery, and badges.")}
                  </li>
                  <li>2) {t("Add photos, specs, and quality proofs.")}</li>
                  <li>3) {t("Manage stock and respond to buyer Q&A.")}</li>
                  <li>4) {t("Track orders and fulfillment performance.")}</li>
                  <li>
                    5){" "}
                    {t(
                      "View analytics: views, conversions, regions, cancellations.",
                    )}
                  </li>
                </ol>
              </div>
            </div>

            <div className="glass-card rounded-card p-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                {t("Safety & trust")}
              </h3>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="glass-card rounded-card p-3 border border-green-500 border-opacity-30">
                  <p className="font-semibold text-green-400">
                    {t("Verified sellers")}
                  </p>
                  <p className="text-gray-300">
                    {t(
                      "Document checks, badges on cards, visible last-updated date.",
                    )}
                  </p>
                </div>
                <div className="glass-card rounded-card p-3 border border-yellow-500 border-opacity-30">
                  <p className="font-semibold text-yellow-400">
                    {t("Quality & reviews")}
                  </p>
                  <p className="text-gray-300">
                    {t(
                      "Quality grade, certifications, ratings with photos, dispute link.",
                    )}
                  </p>
                </div>
                <div className="glass-card rounded-card p-3 border border-blue-500 border-opacity-30">
                  <p className="font-semibold text-blue-400">
                    {t("Clarity before order")}
                  </p>
                  <p className="text-gray-300">
                    {t(
                      "Delivery type, ETA, returns/warranty (if applicable), total cost preview.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
