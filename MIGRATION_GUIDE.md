# API Migration: Gemini to Groq

## Changes Made

This document outlines the migration from Google's Gemini API to Groq's API for the Smart AgroConnect chatbot service.

### What Changed

1. **Service File**: `backend/services/geminiService.js`
   - Replaced Google Generative AI SDK with Groq SDK
   - Updated API initialization to use Groq client
   - Changed model from `gemini-2.0-flash` to `llama-3.1-8b-instant`
   - Modified chat history management to work with OpenAI-compatible format

2. **Dependencies**: `backend/package.json`
   - Removed: `@google/genai` and `@google/generative-ai`
   - Added: `groq-sdk` (v0.3.0)

3. **Environment Variables**
   - Changed from `GEMINI_API_KEY` to `GROQ_API_KEY`

### Getting Your Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

### Setup Instructions

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Update your `.env` file:

   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Start the server:
   ```bash
   npm start
   ```

### API Features

The Groq API implementation includes:

- **Model**: `llama-3.1-8b-instant` (fast inference, 128K context window)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 500 (concise responses)
- **Chat History**: Maintains last 20 messages for context
- **Fallback**: Automatic fallback to predefined responses if API fails

### Functions Maintained

All existing functions continue to work without changes:

- `initializeChat()` - Initializes the chat session
- `sendMessage(userMessage)` - Sends a message and gets response
- `getFarmingAdvice(query, cropName, location)` - Get crop-specific advice
- `getPestAdvice(pestName, cropName, location)` - Get pest management advice
- `getSoilAdvice(soilType, cropName, location)` - Get soil recommendations
- `resetChat()` - Resets the conversation history

### Testing

Test the API integration:

```javascript
// Example: Send a test message
const { sendMessage } = require("./services/geminiService");

sendMessage("What is the best time to plant rice?")
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

### Benefits of Groq

- ⚡ **Fast inference**: Up to 10x faster than traditional APIs
- 💰 **Cost-effective**: Competitive pricing
- 🔒 **Reliable**: High uptime and availability
- 🌐 **Compatible**: OpenAI-compatible API format
- 📊 **Multiple models**: Access to Llama, Mixtral, and other models

### Troubleshooting

If you encounter issues:

1. **API Key Error**: Verify your `GROQ_API_KEY` is set correctly in `.env`
2. **Rate Limits**: Check your Groq console for rate limit information
3. **Fallback Responses**: If you see generic responses, the API might be failing - check logs
4. **Network Issues**: Ensure your server has internet access to reach api.groq.com

### Support

For Groq API documentation, visit: [https://console.groq.com/docs](https://console.groq.com/docs)
