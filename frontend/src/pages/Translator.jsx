import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaExchangeAlt, FaLanguage, FaCopy } from "react-icons/fa";

const Translator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("kannada");
  const [loading, setLoading] = useState(false);

  // Swap languages
  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Handle translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/translations/translate", {
        text: sourceText,
        targetLanguage: targetLanguage,
        sourceLanguage: sourceLanguage,
      });

      setTranslatedText(response.data.translated);
      toast.success("Translation completed!");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Clear all
  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaLanguage className="text-5xl text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            English ↔ Kannada Translator
          </h1>
          <p className="text-gray-600">Powered by AI • ಎಐ ಮೂಲಕ ಚಾಲಿತ</p>
        </div>

        {/* Main Translation Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Language Selector Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Source Language */}
              <div className="flex-1">
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full max-w-xs px-4 py-3 rounded-lg bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                >
                  <option value="english">English</option>
                  <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                </select>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapLanguages}
                className="mx-4 p-3 bg-white rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Swap languages"
              >
                <FaExchangeAlt className="text-blue-600 text-xl" />
              </button>

              {/* Target Language */}
              <div className="flex-1 flex justify-end">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full max-w-xs px-4 py-3 rounded-lg bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
                >
                  <option value="english">English</option>
                  <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Translation Boxes */}
          <div className="grid md:grid-cols-2 gap-0 divide-x divide-gray-200">
            {/* Source Text Box */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  {sourceLanguage === "english" ? "English Text" : "ಕನ್ನಡ ಪಠ್ಯ"}
                </label>
                {sourceText && (
                  <button
                    onClick={() => handleCopy(sourceText)}
                    className="text-blue-600 hover:text-blue-700 p-2"
                  >
                    <FaCopy />
                  </button>
                )}
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={
                  sourceLanguage === "english"
                    ? "Enter text to translate..."
                    : "ಅನುವಾದಿಸಲು ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ..."
                }
                className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-lg"
                style={{
                  fontFamily:
                    sourceLanguage === "kannada"
                      ? "Noto Sans Kannada, sans-serif"
                      : "inherit",
                }}
              />
              <div className="mt-2 text-sm text-gray-500">
                {sourceText.length} characters
              </div>
            </div>

            {/* Translated Text Box */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  {targetLanguage === "english"
                    ? "English Translation"
                    : "ಕನ್ನಡ ಅನುವಾದ"}
                </label>
                {translatedText && (
                  <button
                    onClick={() => handleCopy(translatedText)}
                    className="text-purple-600 hover:text-purple-700 p-2"
                  >
                    <FaCopy />
                  </button>
                )}
              </div>
              <div
                className="w-full h-64 p-4 bg-white border-2 border-gray-200 rounded-lg overflow-y-auto text-lg"
                style={{
                  fontFamily:
                    targetLanguage === "kannada"
                      ? "Noto Sans Kannada, sans-serif"
                      : "inherit",
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : translatedText ? (
                  <p className="whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p className="text-gray-400 italic">
                    Translation will appear here...
                  </p>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {translatedText.length} characters
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleTranslate}
                disabled={loading || !sourceText.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? "Translating..." : "Translate"}
              </button>
              <button
                onClick={handleClear}
                className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-lg"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-bold text-lg mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Advanced AI technology for accurate translations
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Fast & Reliable</h3>
            <p className="text-gray-600 text-sm">
              Get instant translations with high accuracy
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-bold text-lg mb-2">Bidirectional</h3>
            <p className="text-gray-600 text-sm">
              Translate from English to Kannada and vice versa
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span>ℹ️</span> Usage Tips
          </h3>
          <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
            <li>Type or paste your text in the left box</li>
            <li>Select your source and target languages</li>
            <li>Click "Translate" to get instant results</li>
            <li>Use the swap button to reverse language direction</li>
            <li>Click the copy icon to copy translated text</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Translator;
