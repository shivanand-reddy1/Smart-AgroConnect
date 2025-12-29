import React, { useState } from "react";
import { FaLeaf, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const fertilizerDb = {
  // Rice / Paddy
  rice: [
    { name: "Urea", composition: "N 46%" },
    { name: "DAP (Di-ammonium Phosphate)", composition: "N 18% - P 46%" },
    { name: "MOP (Muriate of Potash)", composition: "K 60%" },
  ],
  paddy: [],

  // Ragi / Finger Millet
  ragi: [
    { name: "NPK 20-20-20", composition: "N 20% - P 20% - K 20%" },
    { name: "DAP", composition: "N 18% - P 46%" },
    { name: "Urea", composition: "N 46%" },
  ],
  "finger millet": [],

  // Jowar / Sorghum
  jowar: [
    { name: "Urea", composition: "N 46%" },
    { name: "DAP", composition: "N 18% - P 46%" },
    { name: "MOP", composition: "K 60%" },
  ],
  sorghum: [],

  // Maize
  maize: [
    { name: "Urea", composition: "N 46%" },
    { name: "DAP", composition: "N 18% - P 46%" },
    { name: "NPK 20-20-20", composition: "N 20% - P 20% - K 20%" },
  ],

  // Wheat
  wheat: [
    { name: "Urea", composition: "N 46%" },
    { name: "SSP (Single Super Phosphate)", composition: "P 16%" },
    { name: "MOP", composition: "K 60%" },
  ],

  // Sugarcane
  sugarcane: [
    { name: "Urea", composition: "N 46%" },
    { name: "MOP", composition: "K 60%" },
    { name: "NPK 10-26-26", composition: "N 10% - P 26% - K 26%" },
  ],

  // Cotton
  cotton: [
    { name: "Urea", composition: "N 46%" },
    { name: "DAP", composition: "N 18% - P 46%" },
    { name: "MOP", composition: "K 60%" },
  ],

  // Groundnut
  groundnut: [
    { name: "DAP", composition: "N 18% - P 46%" },
    { name: "MOP", composition: "K 60%" },
    {
      name: "Gypsum (Calcium Sulphate)",
      composition: "Ca 23% - S 18% (approx)",
    },
  ],

  // Sunflower
  sunflower: [
    { name: "NPK 20-20-20", composition: "N 20% - P 20% - K 20%" },
    { name: "DAP", composition: "N 18% - P 46%" },
    { name: "MOP", composition: "K 60%" },
  ],

  // Soybean
  soybean: [
    { name: "DAP", composition: "N 18% - P 46%" },
    { name: "MOP", composition: "K 60%" },
    { name: "ZnSO4 (Zinc Sulphate)", composition: "Zn 20-21% (approx)" },
  ],

  // Arecanut
  arecanut: [
    { name: "NPK 10-26-26", composition: "N 10% - P 26% - K 26%" },
    { name: "MOP", composition: "K 60%" },
    { name: "Urea", composition: "N 46%" },
  ],

  // Coffee
  coffee: [
    { name: "NPK 17-17-17", composition: "N 17% - P 17% - K 17%" },
    { name: "MOP", composition: "K 60%" },
    { name: "Urea", composition: "N 46%" },
  ],

  // Coconut
  coconut: [
    { name: "NPK 8-16-16", composition: "N 8% - P 16% - K 16%" },
    { name: "MOP", composition: "K 60%" },
    { name: "Urea", composition: "N 46%" },
  ],

  // Pulses (Tur, Moong, Urad)
  pulses: [
    { name: "DAP", composition: "N 18% - P 46%" },
    { name: "MOP", composition: "K 60%" },
    { name: "Gypsum", composition: "Ca 23% - S 18% (approx)" },
  ],
  tur: [],
  moong: [],
  urad: [],

  // Cashew
  cashew: [
    { name: "NPK 15-15-15", composition: "N 15% - P 15% - K 15%" },
    { name: "MOP", composition: "K 60%" },
    { name: "Urea", composition: "N 46%" },
  ],
};

// alias keys point to primary entries (avoid duplication)
fertilizerDb.paddy = fertilizerDb.rice;
fertilizerDb["finger millet"] = fertilizerDb.ragi;
fertilizerDb.sorghum = fertilizerDb.jowar;
fertilizerDb.tur = fertilizerDb.pulses;
fertilizerDb.moong = fertilizerDb.pulses;
fertilizerDb.urad = fertilizerDb.pulses;

const normalize = (s) => (s || "").toString().trim().toLowerCase();

export default function FertilizerAlerts() {
  const { t } = useLanguage();
  const [crop, setCrop] = useState("");
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = normalize(crop);
    const found = fertilizerDb[key];
    if (found) setResults({ crop: crop.trim(), list: found });
    else
      setResults({
        crop: crop.trim(),
        list: [
          { name: "NPK 20-20-20", composition: "N 20% - P 20% - K 20%" },
          { name: "Urea", composition: "N 46% - P 0% - K 0%" },
          { name: "MOP", composition: "N 0% - P 0% - K 60%" },
        ],
        note: "No crop-specific recommendation found — showing general balanced fertilizers.",
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaLeaf className="text-3xl text-green-400" />
        <h1 className="text-2xl font-semibold">{t("Fertilizer Alerts")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("Enter crop name")}
        </label>
        <div className="flex gap-2">
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder={t("e.g. rice, wheat, maize, potato")}
            className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-95"
          >
            {t("Submit")}
          </button>
        </div>
      </form>

      {results && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            {t("Recommendations for")} "{results.crop || t("Unknown")}"
          </h2>
          {results.note && (
            <p className="text-sm text-yellow-300 mb-3">{results.note}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.list.map((f, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl text-green-300 mt-1">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{f.name}</div>
                    <div className="text-sm text-gray-300 mt-1">
                      {f.composition}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
