import React, { useMemo, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const schemeData = [
  {
    id: "pmkisan",
    name: "PM-KISAN Income Support",
    category: "Central",
    type: "Direct Benefit",
    state: "Pan India",
    crops: ["All"],
    farmerCategory: ["Small", "Marginal"],
    subsidyType: "Income support",
    incomeType: "All",
    benefitAmount: "₹6,000/year",
    benefitType: "Cash transfer",
    deadline: "Ongoing",
    applicationLink: "https://pmkisan.gov.in/",
    tags: ["Income", "Direct benefit", "Small farmers"],
    eligibility:
      "Small and marginal farmer families with cultivable land; exclusions apply for institutional/government service holders.",
    documents: ["Aadhaar", "Bank passbook", "Land record"],
    steps: [
      "Check eligibility and exclusions",
      "Link Aadhaar with bank and land records",
      "Submit application via local agriculture office or CSC",
      "Track status with mobile/PM-KISAN portal",
    ],
    contacts: {
      phone: "155261 / 1800-115-526",
      email: "pmkisan-ict@gov.in",
      office: "Local Agriculture Office / CSC",
    },
    faq: [
      "Installments are released every 4 months to eligible beneficiaries.",
      "Ensure bank account is NPCI/Aadhaar linked to avoid rejections.",
    ],
    lastUpdated: "2d ago",
    status: "Open",
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Central",
    type: "Crop Insurance",
    state: "Pan India",
    crops: ["Notified crops"],
    farmerCategory: ["All"],
    subsidyType: "Insurance subsidy",
    incomeType: "All",
    benefitAmount: "Sum insured per crop as notified",
    benefitType: "Insurance",
    deadline: "Before sowing / as notified",
    applicationLink: "https://pmfby.gov.in/",
    tags: ["Insurance", "Risk cover", "Climate"],
    eligibility:
      "All farmers growing notified crops in notified areas; enrol before cutoff; loanee farmers auto-enrolled unless they opt out.",
    documents: ["Aadhaar", "Land record/tenancy proof", "Sowing certificate"],
    steps: [
      "Check notified crops/areas and cutoff date",
      "Submit proposal via bank/portal/CSC with land and sowing proof",
      "Pay farmer premium share",
      "Track claim status; report loss within 72 hours for localized claims",
    ],
    contacts: {
      phone: "1800-180-1111",
      email: "help@pmfby.gov.in",
      office: "Bank / CSC / Insurance company desk",
    },
    faq: [
      "Premium: 2% Kharif, 1.5% Rabi, 5% commercial/horticulture crops.",
      "Claims are based on notified yield and weather/loss reports.",
    ],
    lastUpdated: "5d ago",
    status: "Open",
  },
  {
    id: "soilhealth",
    name: "Soil Health & Nutrient Management",
    category: "Central",
    type: "Soil Health",
    state: "Pan India",
    crops: ["All"],
    farmerCategory: ["All"],
    subsidyType: "Advisory",
    incomeType: "All",
    benefitAmount: "Free/low-cost testing",
    benefitType: "Service",
    deadline: "Ongoing",
    applicationLink: "https://soilhealth.dac.gov.in/",
    tags: ["Soil", "Testing", "Advisory"],
    eligibility: "All farmers; periodic testing recommended every 2 years.",
    documents: ["ID proof", "Land record"],
    steps: [
      "Collect soil samples as per guideline",
      "Submit at nearest soil lab/collection point",
      "Receive Soil Health Card and recommendations",
      "Apply nutrients as per advisory",
    ],
    contacts: {
      phone: "Local agri office",
      email: "",
      office: "Soil testing lab / KVK",
    },
    faq: ["Retest every 2 years or after major land use change."],
    lastUpdated: "7d ago",
    status: "Open",
  },
  {
    id: "irrigation",
    name: "Micro-Irrigation & Drip Subsidy",
    category: "State",
    type: "Irrigation",
    state: "Karnataka",
    crops: ["Horticulture", "Vegetables"],
    farmerCategory: ["Small", "Marginal"],
    subsidyType: "Capex subsidy",
    incomeType: "All",
    benefitAmount: "Up to 55% (general), 60% (SC/ST)",
    benefitType: "Subsidy",
    deadline: "31 Mar 2026",
    applicationLink: "https://raitamitra.karnataka.gov.in/",
    tags: ["Irrigation", "Water saving", "State"],
    eligibility:
      "Eligible farmers with drip/sprinkler layouts as per department norms; priority for small/marginal and water-stressed blocks.",
    documents: [
      "Aadhaar",
      "Land documents",
      "Water source proof",
      "Layout design/quotation",
    ],
    steps: [
      "Check state guidelines and ceiling",
      "Get vendor quotation and layout approval",
      "Apply online/offline with documents",
      "Install system post-approval and verify",
      "Subsidy release after inspection",
    ],
    contacts: {
      phone: "State Agri Dept helpline",
      email: "",
      office: "Assistant Director of Horticulture",
    },
    faq: ["Higher subsidy slabs for SC/ST and water-stressed areas."],
    lastUpdated: "3d ago",
    status: "Open",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC) Expansion",
    category: "Central",
    type: "Credit",
    state: "Pan India",
    crops: ["All"],
    farmerCategory: ["All"],
    subsidyType: "Credit/interest subvention",
    incomeType: "All",
    benefitAmount: "Up to ₹3L; 2-3% interest subvention",
    benefitType: "Loan",
    deadline: "Ongoing",
    applicationLink:
      "https://www.nabard.org/content1.aspx?id=523&catid=8&mid=530",
    tags: ["Credit", "Working capital", "Livestock"],
    eligibility:
      "All farmers including dairy, fisheries; clean repayment history; land records or activity proof required.",
    documents: ["Aadhaar", "Land/lease proof", "Bank KYC", "Photo"],
    steps: [
      "Apply via bank/CSC with KYC and land/activity proof",
      "Get sanction and RuPay KCC card",
      "Avail credit as cash/overdraft; interest subvention on prompt repayment",
    ],
    contacts: {
      phone: "Bank branch / toll-free 1800-11-0001",
      email: "",
      office: "Nearest bank branch",
    },
    faq: ["Timely repayment qualifies for additional 3% subvention."],
    lastUpdated: "6d ago",
    status: "Open",
  },
  {
    id: "aif",
    name: "Agriculture Infrastructure Fund (AIF)",
    category: "Central",
    type: "Infrastructure",
    state: "Pan India",
    crops: ["All"],
    farmerCategory: ["FPO", "Cooperative", "Individual"],
    subsidyType: "Interest subvention",
    incomeType: "All",
    benefitAmount: "3% interest subvention up to ₹2 cr; CGTMSE guarantee",
    benefitType: "Loan support",
    deadline: "31 Mar 2032",
    applicationLink: "https://agriinfra.dac.gov.in/",
    tags: ["Storage", "Processing", "Value chain"],
    eligibility:
      "Eligible for post-harvest infra (warehouses, cold chain, primary processing) by farmers, FPOs, agri-startups.",
    documents: ["KYC", "Project report", "Land/lease", "CMA data"],
    steps: [
      "Prepare project report and quotations",
      "Apply on AIF portal/bank with documents",
      "Bank appraisal and sanction with 3% subvention",
      "Set up infrastructure and comply with milestones",
    ],
    contacts: {
      phone: "AIF helpdesk 1800-889-1414",
      email: "aif[at]nabard.org",
      office: "Bank / NABARD district office",
    },
    faq: ["CGTMSE guarantee available for eligible borrowers."],
    lastUpdated: "4d ago",
    status: "Open",
  },
  {
    id: "pmfme",
    name: "PM Formalization of Micro Food Processing Enterprises (PMFME)",
    category: "Central",
    type: "Processing",
    state: "Pan India",
    crops: ["All", "Horticulture"],
    farmerCategory: ["Individual", "FPO", "SHG"],
    subsidyType: "Capital subsidy",
    incomeType: "All",
    benefitAmount: "Credit-linked subsidy up to 35% (₹10L cap for individuals)",
    benefitType: "Subsidy",
    deadline: "Ongoing",
    applicationLink: "https://pmfme.mofpi.gov.in/pmfme/",
    tags: ["Processing", "Value addition", "Micro enterprise"],
    eligibility:
      "Existing or new micro food processing units; priority for SHGs, SC/ST, women entrepreneurs.",
    documents: ["KYC", "Udyam", "Project report", "Bank sanction"],
    steps: [
      "Identify product line and prepare DPR",
      "Apply via state PMFME portal/DAFP office",
      "Obtain bank sanction with subsidy consent",
      "Implement project and claim subsidy post-inspection",
    ],
    contacts: {
      phone: "State Nodal Officer (PMFME)",
      email: "",
      office: "District Industries Centre / Agriculture Dept",
    },
    faq: ["Common Facility Centers eligible through FPO/SHG collectives."],
    lastUpdated: "8d ago",
    status: "Open",
  },
  {
    id: "fpo",
    name: "Formation & Promotion of 10,000 FPOs",
    category: "Central",
    type: "Collectives",
    state: "Pan India",
    crops: ["All"],
    farmerCategory: ["Small", "Marginal", "Tenant"],
    subsidyType: "Equity/handholding",
    incomeType: "All",
    benefitAmount: "Equity grant up to ₹15L; credit guarantee up to ₹2 cr",
    benefitType: "Equity support",
    deadline: "Ongoing",
    applicationLink: "https://www.sfacindia.com/",
    tags: ["FPO", "Collective", "Market linkage"],
    eligibility:
      "New/existing FPOs promoted through CBBOs; minimum farmer member norms as per guidelines.",
    documents: ["Registration certificate", "PAN", "Bank details", "Bylaws"],
    steps: [
      "Enroll with Cluster Based Business Organization (CBBO)",
      "Complete incorporation and member enrollment",
      "Apply for equity grant and credit guarantee",
      "Implement business plan with CBBO handholding",
    ],
    contacts: {
      phone: "SFAC helpdesk",
      email: "enquiry@sfac.in",
      office: "CBBO / SFAC state office",
    },
    faq: ["Credit guarantee available via CGTMSE window for FPOs."],
    lastUpdated: "9d ago",
    status: "Open",
  },
];

const categories = [
  "All",
  "Central",
  "State",
  "Insurance",
  "Credit",
  "Infrastructure",
  "Processing",
  "Livestock",
  "Collectives",
  "Millet",
  "Irrigation",
  "Soil",
  "Income",
  "Loan",
  "Subsidy",
  "Advisory",
];
const filtersList = {
  state: "State",
  crop: "Crop type",
  farmerCategory: "Farmer category",
  subsidyType: "Subsidy type",
  incomeType: "Income type",
};

const GovernmentSchemes = () => {
  const { t } = useLanguage();

  // Keep English keys for filtering logic
  const categoryKeys = [
    "All",
    "Central",
    "State",
    "Direct Benefit",
    "Crop Insurance",
    "Soil Health",
    "Irrigation",
    "Credit",
    "Infrastructure",
    "Processing",
    "Livestock",
    "Collectives",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    crop: "",
    farmerCategory: "",
    subsidyType: "",
    incomeType: "",
  });
  const [compare, setCompare] = useState([]);
  const [showDeadlines, setShowDeadlines] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return schemeData.filter((s) => {
      if (selectedCategory !== "All") {
        const cat = s.category.toLowerCase();
        const type = s.type.toLowerCase();
        if (
          cat !== selectedCategory.toLowerCase() &&
          !type.includes(selectedCategory.toLowerCase())
        ) {
          return false;
        }
      }

      if (
        filters.state &&
        s.state.toLowerCase().indexOf(filters.state.toLowerCase()) === -1
      )
        return false;
      if (
        filters.crop &&
        !s.crops.some((c) =>
          c.toLowerCase().includes(filters.crop.toLowerCase())
        )
      )
        return false;
      if (
        filters.farmerCategory &&
        !s.farmerCategory.some((f) =>
          f.toLowerCase().includes(filters.farmerCategory.toLowerCase())
        )
      )
        return false;
      if (
        filters.subsidyType &&
        s.subsidyType
          .toLowerCase()
          .indexOf(filters.subsidyType.toLowerCase()) === -1
      )
        return false;
      if (
        filters.incomeType &&
        s.incomeType.toLowerCase().indexOf(filters.incomeType.toLowerCase()) ===
          -1
      )
        return false;

      if (q) {
        const hay = `${s.name} ${s.type} ${s.category} ${
          s.state
        } ${s.tags?.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, filters, search]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCompare = (id) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const compareItems = schemeData.filter((s) => compare.includes(s.id));

  // Get schemes with deadlines (not "Ongoing")
  const upcomingDeadlines = schemeData
    .filter((s) => s.deadline !== "Ongoing")
    .map((s) => {
      // Parse deadline to calculate days left
      const deadlineDate = new Date(s.deadline);
      const today = new Date();
      const daysLeft = Math.ceil(
        (deadlineDate - today) / (1000 * 60 * 60 * 24)
      );

      return {
        ...s,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        urgency:
          daysLeft <= 7 ? "urgent" : daysLeft <= 30 ? "moderate" : "normal",
      };
    })
    .filter((s) => s.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="glass-card rounded-card p-6 animate-fadeIn flex-1">
            <p className="text-sm uppercase tracking-wide text-gradient font-semibold">
              {t("Government Schemes")}
            </p>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              {t("Discover, apply, and track schemes in one place")}
            </h1>
            <p className="text-text-secondary mt-1 max-w-2xl">
              {t(
                "Central and state subsidies, loans, insurance, soil and irrigation support—shown with clear eligibility, documents, steps, and deadlines in farmer-friendly language."
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeadlines(!showDeadlines)}
              className="px-4 py-2 glass-card rounded-button text-sm text-white hover:bg-gradient-primary transition-all duration-250 hover:scale-103"
            >
              {showDeadlines
                ? t("Hide Deadlines")
                : t("🔔 View Deadline Alerts")}
            </button>
          </div>
        </div>

        {/* Deadline Reminders Section */}
        {showDeadlines && upcomingDeadlines.length > 0 && (
          <div className="glass-card rounded-card p-6 mb-6 animate-fadeIn border-2 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                ⚠️ {t("Upcoming Deadlines")}
              </h2>
              <span className="text-sm text-yellow-400">
                {upcomingDeadlines.length} {t("schemes closing soon")}
              </span>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((scheme) => (
                <div
                  key={scheme.id}
                  className={`p-4 rounded-card ${
                    scheme.urgency === "urgent"
                      ? "bg-red-500 bg-opacity-20 border border-red-500"
                      : scheme.urgency === "moderate"
                      ? "bg-yellow-500 bg-opacity-20 border border-yellow-500"
                      : "bg-blue-500 bg-opacity-20 border border-blue-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {scheme.name}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">
                        {t("Category:")} {scheme.category} • {scheme.type}
                      </p>
                      <p className="text-sm text-gray-300">
                        {t("Benefit:")} {scheme.benefitAmount}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          scheme.urgency === "urgent"
                            ? "text-red-400"
                            : scheme.urgency === "moderate"
                            ? "text-yellow-400"
                            : "text-blue-400"
                        }`}
                      >
                        {scheme.daysLeft}
                      </div>
                      <div className="text-xs text-gray-300">
                        {t("days left")}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {t("Deadline:")} {scheme.deadline}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {scheme.applicationLink && (
                      <a
                        href={scheme.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-primary text-white rounded-button hover:shadow-glow-purple transition-all duration-250 hover:scale-105 text-sm font-semibold"
                      >
                        {t("Apply Now")} →
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setShowDeadlines(false);
                        setSearch(scheme.name);
                      }}
                      className="px-4 py-2 glass-card text-white rounded-button hover:bg-white hover:bg-opacity-10 transition-all duration-250 text-sm"
                    >
                      {t("View Details")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[320px,1fr] gap-6 items-start">
          {/* Filters */}
          <aside className="glass-card rounded-card p-4 sticky top-24">
            <h3 className="text-lg font-semibold mb-3 text-white">
              {t("Categories")}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {categoryKeys.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-3 py-2 rounded-button text-sm transition-all duration-250 hover:scale-103 focus:outline-none ${
                    selectedCategory === cat
                      ? "bg-gradient-primary text-white shadow-glow-purple"
                      : "glass-card text-white hover:bg-gradient-primary"
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder={t("Search schemes")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("State")}
                value={filters.state}
                onChange={(e) => handleFilter("state", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Crop type")}
                value={filters.crop}
                onChange={(e) => handleFilter("crop", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Farmer category")}
                value={filters.farmerCategory}
                onChange={(e) => handleFilter("farmerCategory", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Subsidy type")}
                value={filters.subsidyType}
                onChange={(e) => handleFilter("subsidyType", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
              <input
                type="text"
                placeholder={t("Income type")}
                value={filters.incomeType}
                onChange={(e) => handleFilter("incomeType", e.target.value)}
                className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
              />
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            <div className="glass-card rounded-card p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {t("Scheme Feed")}
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

              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((s) => (
                  <article
                    key={s.id}
                    className="glass-card rounded-card p-4 hover:bg-white hover:bg-opacity-5 hover:shadow-lg hover:border-purple-500 hover:border-opacity-50 transition-all duration-250 group hover:scale-[1.01] border border-transparent"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase text-purple-400 font-semibold transition-colors">
                          {s.category} • {s.type}
                        </p>
                        <h3 className="text-lg font-semibold text-white leading-snug">
                          {s.name}
                        </h3>
                        <p className="text-sm text-gray-400 transition-colors">
                          {t("Region:")} {t(s.state)}
                        </p>
                      </div>
                      <label className="text-xs text-gray-400 flex items-center gap-1 transition-colors">
                        <input
                          type="checkbox"
                          checked={compare.includes(s.id)}
                          onChange={() => toggleCompare(s.id)}
                          className="accent-purple-600"
                        />
                        {t("Compare")}
                      </label>
                    </div>

                    <p className="text-sm text-gray-300 mt-2 mb-3 transition-colors">
                      {s.tags?.slice(0, 3).join(" • ")}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs mb-3">
                      <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-button transition-colors">
                        {t("Benefit:")} {s.benefitAmount}
                      </span>
                      <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-button transition-colors">
                        {t("Last date:")} {t(s.deadline)}
                      </span>
                      <span className="px-2 py-1 bg-orange-500 bg-opacity-20 text-orange-400 rounded-button transition-colors">
                        {t("Status:")} {t(s.status)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-300 space-y-1 mb-3 transition-colors">
                      <p>
                        <span className="font-semibold text-white">
                          {t("Eligibility:")}
                        </span>{" "}
                        {s.eligibility}
                      </p>
                      <p>
                        <span className="font-semibold text-white">
                          {t("Documents:")}
                        </span>{" "}
                        {s.documents.join(", ")}
                      </p>
                    </div>

                    <div className="text-xs text-gray-300 space-y-1 mb-3 transition-colors">
                      <p className="font-semibold text-white">{t("Steps:")}</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {s.steps.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 text-xs mb-3 flex-wrap">
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-button transition-colors">
                        {t("Contacts:")} {s.contacts.phone}
                      </span>
                      {s.contacts.office && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-button transition-colors">
                          {t("Office:")} {s.contacts.office}
                        </span>
                      )}
                    </div>

                    {/* Apply Now Button */}
                    {s.applicationLink && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <a
                          href={s.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center px-4 py-2 bg-gradient-primary text-white rounded-button hover:shadow-glow-purple transition-all duration-250 hover:scale-105 font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t("Apply Now")} →
                        </a>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>

            {compareItems.length > 0 && (
              <div className="glass-card rounded-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {t("Compare schemes")}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {t("Select up to 3")}
                  </span>
                </div>
                <div className="overflow-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-800 text-gray-300">
                      <tr>
                        <th className="px-3 py-2">{t("Scheme")}</th>
                        <th className="px-3 py-2">{t("Benefit")}</th>
                        <th className="px-3 py-2">{t("Region")}</th>
                        <th className="px-3 py-2">{t("Deadline")}</th>
                        <th className="px-3 py-2">{t("Documents")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareItems.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-gray-700 last:border-0"
                        >
                          <td className="px-3 py-2 font-semibold text-white">
                            {c.name}
                          </td>
                          <td className="px-3 py-2 text-white">
                            {c.benefitAmount}
                          </td>
                          <td className="px-3 py-2 text-gray-300">{c.state}</td>
                          <td className="px-3 py-2 text-gray-300">
                            {c.deadline}
                          </td>
                          <td className="px-3 py-2 text-gray-300">
                            {c.documents.join(", ")}
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
                  {t("Application guidance")}
                </h3>
                <ol className="space-y-1 text-sm text-gray-300">
                  <li>1) {t("Check eligibility and exclusions.")}</li>
                  <li>
                    2){" "}
                    {t(
                      "Gather documents (ID, land, bank, crop/quotation as needed)."
                    )}
                  </li>
                  <li>
                    3){" "}
                    {t(
                      "Follow steps: apply online/offline → submit → get reference number."
                    )}
                  </li>
                  <li>
                    4){" "}
                    {t(
                      "Track status: draft → submitted → under review → approved/rejected."
                    )}
                  </li>
                  <li>
                    5) {t("Alerts for deadlines, corrections, and approvals.")}
                  </li>
                </ol>
              </div>
              <div className="glass-card rounded-card p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {t("How-to guides & checklists")}
                </h3>
                <ul className="space-y-1 text-sm text-gray-300 list-disc list-inside">
                  <li>
                    {t(
                      "Checklist: eligibility proof, documents ready, reference saved."
                    )}
                  </li>
                  <li>
                    {t(
                      "Guide: filling forms without errors (names, Aadhaar, bank)."
                    )}
                  </li>
                  <li>
                    {t(
                      "Guide: timelines—apply before cutoff; report losses within 72h for insurance."
                    )}
                  </li>
                  <li>
                    {t("Guide: grievance & contact channels if delayed.")}
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass-card rounded-card p-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                {t("Alerts & updates")}
              </h3>
              <p className="text-sm text-gray-300">
                {t(
                  "Subscribe by state, crop, and category to get: new schemes, closing soon, status changes, and required corrections."
                )}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
