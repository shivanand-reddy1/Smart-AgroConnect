const mongoose = require("mongoose");

const governmentSchemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  ministry: String,
  objective: String,
  targetBeneficiary: String,
  eligibility: [
    {
      criteria: String,
      requirement: String,
    },
  ],
  benefits: [
    {
      type: String,
      amount: String,
      description: String,
    },
  ],
  applicationProcess: [
    {
      step: Number,
      description: String,
      documents: [String],
    },
  ],
  requiredDocuments: [String],
  applicationDeadline: Date,
  applicationLink: String,
  contactDetails: {
    phone: String,
    email: String,
    office: String,
  },
  state: String,
  category: {
    type: String,
    enum: ["subsidy", "loan", "insurance", "training", "technology", "other"],
  },
  fundingAmount: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("GovernmentScheme", governmentSchemeSchema);
