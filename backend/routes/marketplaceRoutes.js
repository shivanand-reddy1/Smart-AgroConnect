const express = require("express");
const {
  createListing,
  getAllListings,
  getListingDetails,
  createBuyerRequest,
  getBuyerRequests,
  sendMessage,
  getMessages,
} = require("../controllers/marketplaceController");
const { auth, roleBasedAccess } = require("../middleware/authMiddleware");

const router = express.Router();

// Listings
router.post("/listings", auth, roleBasedAccess(["farmer"]), createListing);
router.get("/listings", auth, getAllListings);
router.get("/listings/:listingId", auth, getListingDetails);

// Buyer Requests
router.post(
  "/buyer-requests",
  auth,
  roleBasedAccess(["buyer"]),
  createBuyerRequest
);
router.get("/buyer-requests", auth, getBuyerRequests);

// Messaging
router.post("/messages", auth, sendMessage);
router.get("/messages", auth, getMessages);

module.exports = router;
