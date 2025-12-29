import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaImage, FaBug } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const PestDetection = () => {
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // =============================
  // HANDLE IMAGE UPLOAD
  // =============================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // =============================
  // SEND IMAGE TO PYTHON ML API
  // =============================
  const detectDisease = async () => {
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      toast.success("Disease detected successfully");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to detect disease");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-card p-8 w-full max-w-5xl">
        {/* ================= HEADER ================= */}
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FaBug />
          {t("Mushroom Disease Detection (AI)")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ================= LEFT PANEL ================= */}
          <div className="glass-card p-6 rounded-card">
            <h3 className="text-lg font-semibold mb-4">
              {t("Upload Mushroom Image")}
            </h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-card p-6 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaImage className="text-4xl mx-auto mb-2" />
                  <p>{t("Click to upload image")}</p>
                  <p className="text-xs">{t("PNG / JPG only")}</p>
                </label>
              </div>

              {preview && (
                <div>
                  <p className="text-sm mb-2">{t("Preview")}</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-card"
                  />
                </div>
              )}

              <button
                onClick={detectDisease}
                disabled={loading}
                className="w-full py-2 rounded-button font-semibold"
              >
                {loading ? t("Analyzing...") : t("Detect Disease")}
              </button>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="glass-card p-6 rounded-card">
            <h3 className="text-lg font-semibold mb-4">
              {t("Detection Result")}
            </h3>

            {!result && !loading && (
              <p className="text-center">
                {t("Upload an image and click detect")}
              </p>
            )}

            {loading && (
              <p className="text-center">{t("AI is analyzing the image...")}</p>
            )}

            {result && (
              <div className="glass-card p-4 rounded-card space-y-2">
                <p className="text-sm">{t("Detected Disease")}</p>
                <p className="text-2xl font-bold">
                  {result.disease_name || result.disease}
                </p>
                <p className="text-sm mt-2">
                  {t("Confidence")}: {result.confidence_score} / 100
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestDetection;
