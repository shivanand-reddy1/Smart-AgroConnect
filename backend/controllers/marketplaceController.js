const MarketplaceListing = require("../models/MarketplaceListing");
const BuyerRequest = require("../models/BuyerRequest");
const Message = require("../models/Message");
const User = require("../models/User");

// Create listing
const createListing = async (req, res) => {
  try {
    const { cropName, variety, quantity, pricePerUnit, location } = req.body;
    const farmerId = req.user.userId;

    const listing = new MarketplaceListing({
      farmerId,
      cropName,
      variety,
      quantity,
      pricePerUnit,
      location,
      ...req.body,
    });

    await listing.save();

    res.status(201).json({ message: "Listing created", listing });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating listing", error: error.message });
  }
};

// Get all listings
const getAllListings = async (req, res) => {
  try {
    const { crop, state, city, minPrice, maxPrice } = req.query;

    let query = { availability: "available" };

    if (crop) query.cropName = new RegExp(crop, "i");
    if (state) query["location.state"] = state;
    if (city) query["location.city"] = city;
    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = minPrice;
      if (maxPrice) query.pricePerUnit.$lte = maxPrice;
    }

    const listings = await MarketplaceListing.find(query)
      .populate("farmerId", "name phone email location")
      .sort({ createdAt: -1 });

    res.json({
      total: listings.length,
      listings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching listings", error: error.message });
  }
};

// Get listing details
const getListingDetails = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await MarketplaceListing.findById(listingId).populate(
      "farmerId",
      "name phone email location profile"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching listing", error: error.message });
  }
};

// Create buyer request
const createBuyerRequest = async (req, res) => {
  try {
    const { cropName, quantity, budgetPerUnit, location } = req.body;
    const buyerId = req.user.userId;

    const request = new BuyerRequest({
      buyerId,
      cropName,
      quantity,
      budgetPerUnit,
      location,
      ...req.body,
    });

    await request.save();

    res.status(201).json({ message: "Buyer request created", request });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating request", error: error.message });
  }
};

// Get buyer requests
const getBuyerRequests = async (req, res) => {
  try {
    const { crop, state } = req.query;

    let query = { isActive: true };
    if (crop) query.cropName = new RegExp(crop, "i");
    if (state) query["location.state"] = state;

    const requests = await BuyerRequest.find(query)
      .populate("buyerId", "name phone email location")
      .sort({ createdAt: -1 });

    res.json({
      total: requests.length,
      requests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, relatedToListingId } = req.body;
    const senderId = req.user.userId;

    const message = new Message({
      senderId,
      receiverId,
      content,
      relatedToListingId,
    });

    await message.save();

    // Emit socket event for real-time messaging
    if (global.io) {
      global.io.emit("new_message", message);
    }

    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

// Get messages
const getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingDetails,
  createBuyerRequest,
  getBuyerRequests,
  sendMessage,
  getMessages,
};
