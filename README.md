# 🌾 Smart AgroConnect

<div align="center">

![Smart AgroConnect](https://img.shields.io/badge/Smart-AgroConnect-purple?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A comprehensive digital platform empowering farmers with AI-powered tools, real-time insights, and community support**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Overview

Smart AgroConnect is a full-stack agricultural platform designed to bridge the gap between traditional farming and modern technology. It provides Indian farmers with essential tools for better decision-making, market access, and community engagement, with bilingual support in English and Kannada.

## ✨ Features

### 🌤️ **Weather Intelligence**

- Real-time weather forecasts with 5-day predictions
- Location-based weather data for Karnataka, Tamil Nadu, and Andhra Pradesh
- Crop-specific weather analysis and recommendations
- Agricultural activity suggestions based on weather conditions

### 💰 **Market Insights**

- Live agricultural commodity prices
- Price trend analysis and predictions
- Best crop recommendations based on current market rates
- Historical price comparisons
- Market demand insights

### 🐛 **AI Pest Detection**

- Deep learning-based pest and disease identification
- Support for 22+ crop diseases (Cashew, Cassava, Maize, Tomato)
- Image upload for instant diagnosis
- Treatment recommendations and preventive measures
- Disease severity analysis

### 🏛️ **Government Schemes Finder**

- Comprehensive database of central and state agricultural schemes
- Smart filtering by crop type, farmer category, and region
- Eligibility checker with document requirements
- Application guidelines and step-by-step instructions
- Deadline tracking and alerts

### 🛒 **Agricultural Marketplace**

- Buy and sell agricultural inputs (seeds, fertilizers, pesticides)
- Product comparison tools (up to 3 items)
- Verified seller badges and ratings
- Delivery options (home delivery/pickup)
- Organic product filtering

### 💬 **Community Forum**

- Peer-to-peer farmer discussions
- Expert Q&A sections
- Topic-based discussions (crops, pests, market, weather)
- Post creation with rich text support

### 🤖 **AI Chatbot**

- 24/7 farming advisory powered by Google Gemini AI
- Natural language processing in English and Kannada
- Context-aware responses
- Crop cultivation guidance
- Pest management advice

### 📚 **Knowledge Hub**

- Educational articles and guides
- Video tutorials
- Cultivation best practices
- Pest library with detailed information
- Expert tips and techniques

### 🌐 **Bilingual Support**

- Complete English and Kannada language support
- Real-time language switching
- Translated UI and content
- Cultural and regional relevance

---

## 🛠️ Tech Stack

### **Frontend**

- **React.js** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### **Backend**

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Google Gemini AI** - Chatbot integration

### **Machine Learning**

- **Python** - Programming language
- **Flask** - Web framework
- **TensorFlow/Keras** - Deep learning
- **OpenCV** - Image processing
- **NumPy** - Numerical computing

### **APIs & Services**

- **OpenWeather API** - Weather data
- **Google Gemini API** - AI chatbot
- **Cloudinary** - Image storage (optional)

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Python (v3.8 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-agroconnect.git
cd smart-agroconnect
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_KEY=your_openweather_api_key
NODE_ENV=development
EOF

# Start backend server
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start frontend development server
npm start
```

### 4. ML Model Setup

```bash
cd ml-models
pip install -r requirements.txt

# Download or train the model
python train.py

# Start Flask server
python app.py
```

---

## 🚀 Usage

1. **Register an Account**

   - Navigate to `/register`
   - Choose role (Farmer/Expert)
   - Fill in required details

2. **Explore Features**

   - Access dashboard at `/dashboard`
   - Check weather forecasts
   - View market prices
   - Upload pest images for detection

3. **Join Community**

   - Visit community forum
   - Ask questions and share knowledge
   - Chat with AI advisor

4. **Find Government Schemes**

   - Browse available schemes
   - Filter by eligibility
   - Access application guidelines

5. **Use Marketplace**
   - Browse agricultural products
   - Compare prices
   - Contact verified sellers

---

## 📁 Project Structure

```
smart-agroconnect/
├── backend/
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── server.js         # Entry point
│
├── frontend/
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable components
│       ├── contexts/     # React contexts
│       ├── pages/        # Page components
│       ├── utils/        # Utility functions
│       └── App.jsx       # Main app component
│
├── ml-models/
│   ├── dataset/          # Training data
│   ├── static/           # Static files
│   ├── uploads/          # Uploaded images
│   ├── app.py           # Flask server
│   └── train.py         # Model training script
│
└── README.md
```

---

## 🔌 API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Weather

- `GET /api/weather/:location` - Get weather data

### Market Prices

- `GET /api/market-prices` - Get all market prices
- `GET /api/market-prices/:id` - Get specific price

### Pest Detection

- `POST /api/pest-detection/detect` - Upload image for detection
- `GET /api/pest-detection/history` - Get detection history

### Government Schemes

- `GET /api/government-schemes` - Get all schemes
- `GET /api/government-schemes/:id` - Get specific scheme

### Marketplace

- `GET /api/marketplace/listings` - Get all listings
- `POST /api/marketplace/listings` - Create new listing
- `PUT /api/marketplace/listings/:id` - Update listing
- `DELETE /api/marketplace/listings/:id` - Delete listing

### Forum

- `GET /api/forum/posts` - Get all posts
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/:id/comments` - Add comment

### Chatbot

- `POST /api/chatbot/message` - Send message to chatbot

### Translations

- `GET /api/translations?language=kannada` - Get translations
- `POST /api/translations/translate` - Translate text

---

## 🌟 Key Highlights

- **22+ Disease Detection Models** - Trained on extensive agricultural datasets
- **10+ Government Schemes** - Curated database with eligibility filters
- **Real-time Market Data** - Live price updates for major crops
- **AI-Powered Advisory** - Context-aware farming recommendations
- **Bilingual Interface** - Complete English & Kannada support
- **Community Driven** - Farmer-to-farmer knowledge sharing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/agroconnect
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GEMINI_API_KEY=your_gemini_key
WEATHER_API_KEY=your_weather_key
NODE_ENV=development
```

---

## 🐛 Known Issues

- Weather API has rate limits (60 calls/minute)
- ML model requires 2GB+ RAM for inference
- Image uploads limited to 5MB

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Real-time chat between farmers
- [ ] IoT sensor integration
- [ ] Blockchain for supply chain
- [ ] Payment gateway integration
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] Drone imagery analysis
- [ ] Soil testing recommendations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - _Initial work_ - [GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- OpenWeather API for weather data
- Google Gemini AI for chatbot capabilities
- TensorFlow team for ML framework
- Indian agricultural research community
- All contributors and farmers who provided feedback

---

## 📞 Contact & Support

- **Email:** support@smartagroconnect.com
- **GitHub Issues:** [Report Bug](https://github.com/yourusername/smart-agroconnect/issues)
- **Documentation:** [Wiki](https://github.com/yourusername/smart-agroconnect/wiki)

---

<div align="center">

**Made with ❤️ for Indian Farmers**

⭐ Star this repository if you find it helpful!

</div>
