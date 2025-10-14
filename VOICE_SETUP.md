# Quick Setup Guide for Voice Recognition

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new key
4. Copy the API key

## Step 2: Create Environment File

Create a file named `.env` in your project root with:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
VITE_GEMINI_MODEL=gemini-1.5-flash-002
```

## Step 3: Test Voice Recognition

1. Run `npm run dev`
2. Open Chrome browser (works best)
3. Go to the Editor page
4. Click "🎤 Start Voice Capture"
5. Allow microphone access when prompted
6. Speak your resume details

## Troubleshooting

### If voice recognition doesn't work:

1. **Check browser**: Use Chrome, Edge, or Safari
2. **Check microphone**: Ensure microphone is working
3. **Check permissions**: Allow microphone access
4. **Check API key**: Verify Gemini API key is correct
5. **Check console**: Look for error messages in browser console

### Common Issues:

- **"Speech recognition not supported"**: Use Chrome or Edge
- **"Microphone access denied"**: Allow microphone in browser settings
- **"API error"**: Check your Gemini API key
- **"No speech detected"**: Speak louder or closer to microphone

## Alternative Solutions

If voice recognition still doesn't work well:

1. **Manual Input**: Use the text fields directly
2. **Copy-Paste**: Copy text from documents and paste
3. **File Upload**: Upload resume files (if implemented)
4. **Template Fill**: Use pre-made templates

## Supported Languages

- English (US, UK, India)
- Hindi (India)
- Spanish, French, German, Italian
- Portuguese, Russian, Japanese, Korean
- Chinese, Arabic
- And more Indian languages

## Tips for Better Results

1. **Speak clearly** and at normal pace
2. **Use good microphone** quality
3. **Minimize background noise**
4. **Speak in complete sentences**
5. **Include key information** like name, email, phone
6. **Mention skills** explicitly
7. **Describe experience** with company names and roles
