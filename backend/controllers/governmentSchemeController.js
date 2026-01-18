const GovernmentScheme = require("../models/GovernmentScheme");

// Get all government schemes
const getAllSchemes = async (req, res) => {
  try {
    const { state, category } = req.query;

    let query = { isActive: true };
    if (state) query.state = state;
    if (category) query.category = category;

    const schemes = await GovernmentScheme.find(query);

    res.json({
      total: schemes.length,
      schemes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching schemes", error: error.message });
  }
};

// Get scheme details
const getSchemeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = await GovernmentScheme.findById(id);
    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    res.json(scheme);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching scheme", error: error.message });
  }
};

// Check eligibility
const checkEligibility = async (req, res) => {
  try {
    const { schemeId, userId } = req.body;

    const scheme = await GovernmentScheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    // Mock eligibility check
    const eligibility = {
      schemeId,
      isEligible: true,
      eligibilityCriteria: scheme.eligibility,
      requiredDocuments: scheme.requiredDocuments,
      estimatedBenefit: scheme.benefits[0],
    };

    res.json(eligibility);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking eligibility", error: error.message });
  }
};

// Get scheme deadlines
const getSchemeDeadlines = async (req, res) => {
  try {
    const { state } = req.query;

    let query = { isActive: true, applicationDeadline: { $gte: new Date() } };
    if (state) query.state = state;

    const schemes = await GovernmentScheme.find(query).select(
      "name applicationDeadline category state applicationLink description benefits"
    );

    const deadlines = schemes.map((scheme) => ({
      schemeId: scheme._id,
      schemeName: scheme.name,
      deadline: scheme.applicationDeadline,
      daysLeft: Math.ceil(
        (scheme.applicationDeadline - new Date()) / (1000 * 60 * 60 * 24)
      ),
      category: scheme.category,
      state: scheme.state,
      applicationLink: scheme.applicationLink,
      description: scheme.description,
      benefits: scheme.benefits,
      urgency:
        Math.ceil(
          (scheme.applicationDeadline - new Date()) / (1000 * 60 * 60 * 24)
        ) <= 7
          ? "urgent"
          : Math.ceil(
              (scheme.applicationDeadline - new Date()) / (1000 * 60 * 60 * 24)
            ) <= 30
          ? "moderate"
          : "normal",
    }));

    res.json(deadlines.sort((a, b) => a.daysLeft - b.daysLeft));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching deadlines", error: error.message });
  }
};

// Create/Update scheme (Admin)
const createScheme = async (req, res) => {
  try {
    const schemeData = req.body;

    const scheme = new GovernmentScheme(schemeData);
    await scheme.save();

    res.status(201).json({ message: "Scheme created", scheme });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating scheme", error: error.message });
  }
};

module.exports = {
  getAllSchemes,
  getSchemeDetails,
  checkEligibility,
  getSchemeDeadlines,
  createScheme,
};
