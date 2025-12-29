const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

const { auth } = require("./middleware/authMiddleware");
const { getMyProfile } = require("./controllers/userController");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;

// ==========================
// TRUST PROXY
// ==========================
app.set("trust proxy", 1);

// ==========================
// CORS CONFIG
// ==========================
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ==========================
// SECURITY MIDDLEWARE
// ==========================
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ==========================
// RATE LIMITING
// ==========================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/auth", authLimiter);

// ==========================
// DATABASE CONNECTION
// ==========================
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ MONGODB_URI not set. Check backend/.env or your environment variables");
} else {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const connectWithRetry = (attempt = 1) => {
    console.log(`🔌 Attempting MongoDB connection (attempt ${attempt}) to ${mongoUri}`);
    mongoose
      .connect(mongoUri, mongooseOptions)
      .then(() => {
        console.log("✅ MongoDB connected");
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        if (
          (err && err.code === 'ECONNREFUSED') ||
          (err && err.message && err.message.includes('ECONNREFUSED'))
        ) {
          console.error("Connection refused - is MongoDB (mongod) running on 127.0.0.1:27017?");
        }
        const delay = Math.min(30000, 2000 * attempt);
        console.log(`Retrying MongoDB connection in ${delay / 1000}s...`);
        setTimeout(() => connectWithRetry(attempt + 1), delay);
      });
  };

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔁 MongoDB reconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB event error:', err);
  });

  connectWithRetry();

  process.on('SIGINT', async () => {
    try {
      await mongoose.disconnect();
      console.log('🛑 MongoDB connection closed due to app termination');
      process.exit(0);
    } catch (e) {
      console.error('Error during mongoose disconnect', e);
      process.exit(1);
    }
  });
}

// ==========================
// ROUTES
// ==========================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/market-prices", require("./routes/marketPriceRoutes"));
app.use("/api/government-schemes", require("./routes/governmentSchemeRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/marketplace", require("./routes/marketplaceRoutes"));
app.use("/api/forum", require("./routes/forumRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/translations", require("./routes/translationRoutes"));
app.use("/api/knowledge-hub", require("./routes/knowledgeHubRoutes"));

// ==========================
// 🔥 PEST DETECTION (NODE → PYTHON)
// ==========================
app.post("/api/pest-detection/predict", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/api/predict",
      req.body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("ML Service Error:", error.message);
    res.status(500).json({
      message: "Pest detection failed",
    });
  }
});

// ==========================
// PROFILE ROUTE
// ==========================
app.get("/api/user/profile", auth, getMyProfile);

// ==========================
// HEALTH CHECK
// ==========================
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// ==========================
// SOCKET.IO EVENTS
// ==========================
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("join_marketplace", (data) => {
    socket.join(`marketplace_${data.crop}`);
  });

  socket.on("send_message", (data) => {
    io.to(`marketplace_${data.crop}`).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ==========================
// ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = { app, io };
