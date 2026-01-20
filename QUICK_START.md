# 🚀 Quick Start Guide - Groq API

## Get Your API Key

1. Go to: https://console.groq.com
2. Sign up/Login → API Keys → Create New Key
3. Copy your key

## Update Environment

```bash
# In backend/.env file
GROQ_API_KEY=gsk_your_key_here
```

## Install & Run

```bash
cd backend
npm install
npm start
```

## Test It

```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what crops grow well in monsoon?"}'
```

## Key Info

- **Model**: llama-3.1-8b-instant
- **Speed**: ~0.5-1 second response time
- **Context**: 128K tokens
- **Free Tier**: Available with rate limits

## Files Changed

✅ `backend/services/geminiService.js` → Now uses Groq  
✅ `backend/controllers/translationController.js` → Updated  
✅ `backend/controllers/chatbotController.js` → Comments updated  
✅ `backend/package.json` → groq-sdk added  
✅ `backend/.env` → GROQ_API_KEY added

## Need Help?

📖 Docs: https://console.groq.com/docs  
💬 Support: https://groq.com/contact
