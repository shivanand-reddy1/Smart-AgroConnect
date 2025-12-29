const PestDetection = require("../models/PestDetection");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name",
  api_key: process.env.CLOUDINARY_API_KEY || "your_api_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
});

// Detect pest/disease from image
const detectPestFromImage = async (req, res) => {
  try {
    const { cropName, leafOrPest } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Error uploading image", error });
        }

        // Mock CNN model prediction
        const predictions = {
          leaf_disease: {
            "Early Blight": {
              confidence: 0.89,
              symptoms: ["Brown spots", "Yellow halo"],
            },
            "Late Blight": {
              confidence: 0.76,
              symptoms: ["Water-soaked spots", "White mold"],
            },
            "Powdery Mildew": {
              confidence: 0.65,
              symptoms: ["White powder coating"],
            },
          },
          pest: {
            Armyworm: {
              confidence: 0.92,
              symptoms: ["Holes in leaves", "Frass present"],
            },
            "Leaf Folder": {
              confidence: 0.88,
              symptoms: ["Rolled leaves", "Skeletonized areas"],
            },
            "Spider Mite": {
              confidence: 0.73,
              symptoms: ["Yellow stippling", "Fine webbing"],
            },
          },
        };

        const category =
          leafOrPest === "leaf_disease" ? "leaf_disease" : "pest";
        const topPrediction = Object.entries(predictions[category])[0];
        const [detectedIssue, predData] = topPrediction;

        // Save detection record
        const detection = new PestDetection({
          userId: req.user?.userId,
          imageUrl: result.secure_url,
          cropName,
          leafOrPest,
          detectedIssue,
          confidence: predData.confidence,
          symptoms: predData.symptoms,
          description: `${detectedIssue} detected in ${cropName}`,
          prevention:
            category === "leaf_disease"
              ? [
                  "Use resistant varieties",
                  "Proper irrigation",
                  "Fungicide spray",
                ]
              : ["Crop rotation", "Pheromone traps", "Insecticide spray"],
          treatment: [
            {
              type: "Organic",
              method:
                category === "leaf_disease"
                  ? "Neem spray"
                  : "Natural pesticide",
              duration: "3-4 weeks",
            },
            {
              type: "Chemical",
              method: category === "leaf_disease" ? "Fungicide" : "Insecticide",
              duration: "2-3 weeks",
            },
          ],
          organicAlternatives: [
            "Neem oil",
            "Bacillus thuringiensis",
            "Beneficial insects",
          ],
          recommendedProducts: [
            "Neem spray concentrate",
            "Sulfur dust",
            "Copper fungicide",
          ],
        });

        await detection.save();

        res.json({
          message: "Pest/Disease detected",
          detection,
          allPredictions: predictions[category],
        });
      }
    );

    // Upload file stream
    req.file.stream.pipe(uploadStream);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error detecting pest", error: error.message });
  }
};

// Get detection history
const getDetectionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const detections = await PestDetection.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      total: detections.length,
      detections,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching detection history",
        error: error.message,
      });
  }
};

// Get detection details
const getDetectionDetails = async (req, res) => {
  try {
    const { detectionId } = req.params;

    const detection = await PestDetection.findById(detectionId);
    if (!detection) {
      return res.status(404).json({ message: "Detection not found" });
    }

    res.json(detection);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching detection", error: error.message });
  }
};

module.exports = {
  detectPestFromImage,
  getDetectionHistory,
  getDetectionDetails,
};
