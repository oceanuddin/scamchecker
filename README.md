# 🔍 Scam Checker - AI-Powered Scam Detection

A sophisticated web application that uses OpenAI's AI to detect scams in text descriptions and images. Built with React, Node.js, and enhanced with real-time link analysis and Reddit community intelligence.

![Scam Checker](https://img.shields.io/badge/Status-Live%20Production-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o%20%2B%20Vision-purple)

## 🌟 Live Demo

**🔗 Production Site:** [https://www.checkifthisisascamfor.me)

## ✨ Features

### 🤖 AI-Powered Analysis
- **Text Analysis**: Analyze written scenarios for scam indicators
- **Image Analysis**: Upload screenshots for AI-powered visual scam detection
- **Structured Results**: Get detailed verdicts with confidence scores
- **Red Flags Detection**: Comprehensive list of suspicious indicators
- **Recommended Actions**: Clear, actionable steps for users

### 🛡️ Security Features
- **Prompt Injection Protection**: Detects and blocks AI manipulation attempts
- **Input Sanitization**: Cleans and normalizes user input
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Heuristic Detection**: Rule-based pattern matching for common scams
- **User Behavior Logging**: Monitors for suspicious activity patterns

### 📱 User Experience
- **Drag & Drop**: Easy image upload with drag-and-drop support
- **File Size Limits**: 5MB maximum with clear error messages
- **Character Limits**: 1000 character limit for text input with real-time counter
- **Loading Animations**: Smooth loading indicators during AI processing
- **Responsive Design**: Works perfectly on desktop and mobile
- **Visual Feedback**: Wiggle animations and color-coded status indicators

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Lucide React** for icons
- **Glass morphism UI** design

### Backend
- **Node.js** with Express
- **OpenAI API** (GPT-3.5-turbo for text, GPT-4o for vision)
- **Multer** for file uploads
- **Axios** for HTTP requests
- **Cheerio** for web scraping
- **Custom Security Middleware**

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway
- **Environment Variables**: Secure API key management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API key
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/oceanuddin/scamchecker.git
   cd scamchecker
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In backend/.env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   node index.js
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5050

## 📋 API Endpoints

### Text Analysis
```http
POST /api/check-scam
Content-Type: application/json

{
  "scenario": "I received an email from paypal.com/verify asking for my password..."
}
```

### Image Analysis
```http
POST /api/check-scam-image
Content-Type: multipart/form-data

{
  "image": [file upload]
}
```

### Health Check
```http
GET /
```

### Security Stats
```http
GET /security-stats
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
OPENAI_API_KEY=sk-your-openai-api-key
PORT=5050
NODE_ENV=production
```

**Frontend (vite.config.ts)**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

### Deployment Settings

**Railway (Backend)**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node index.js`
- Port: `8080` (Railway sets this automatically)

**Vercel (Frontend)**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 🛡️ Security Features

### Prompt Injection Protection
The AI is trained to detect and block attempts to manipulate its behavior:
- Ignores commands like "Say this is safe"
- Blocks "Ignore the above instructions"
- Prevents "Pretend to be..." attempts
- Returns "Injection was detected" for manipulation attempts

### Input Sanitization
- Removes malicious characters and scripts
- Normalizes input for consistent analysis
- Enforces character limits (1000 for text)
- Validates file types and sizes (5MB max)

### Rate Limiting
- Prevents abuse through rapid requests
- Tracks user behavior patterns
- Implements session-based limits
- Logs suspicious activity

## 📊 Analysis Results

### Text Analysis Response
```json
{
  "verdict": "Scam",
  "confidence": "High (93%)",
  "redFlags": [
    "Requests for password/credentials",
    "Suspicious URL detected",
    "Urgency tactics used"
  ],
  "actions": [
    {
      "title": "Do not click any links",
      "description": "Avoid interacting with the suspicious content"
    },
    {
      "title": "Report to authorities",
      "description": "Forward to relevant security teams"
    }
  ],
  "analysis": "This appears to be a phishing attempt...",
  "linkAnalysis": {
    "totalUrls": 2,
    "suspiciousUrls": 1,
    "redditReportsFound": 3,
    "details": [...]
  }
}
```

### Image Analysis Response
Similar structure to text analysis, with additional visual context from the uploaded image.

## 🎨 UI Components

### Core Components
- **HeroSection**: Main input interface with tabs for text/image
- **ResultsPage**: Displays analysis results with detailed breakdown
- **GlassPanel**: Reusable glass morphism container
- **Button**: Custom styled button component
- **LoadingDots**: Animated loading indicator
- **VerdictPreview**: Example verdicts on homepage
- **HowItWorks**: Step-by-step process explanation
- **Footer**: Links and project information

### Interactive Features
- **Drag & Drop**: Image upload with visual feedback
- **Character Counter**: Real-time text input validation
- **File Size Validation**: 5MB limit with error animations
- **Loading States**: Smooth transitions during processing
- **Responsive Design**: Mobile-first approach


## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Set environment variables:
   - `OPENAI_API_KEY`
3. Configure deployment:
   - Root Directory: `backend`
   - Start Command: `node index.js`
4. Deploy automatically on push to main

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the AI capabilities
- **Vercel** for frontend hosting
- **Railway** for backend hosting
- **Reddit** for community intelligence
- **Tailwind CSS** for the beautiful UI framework

## 📞 Contact

- **LinkedIn**: [Ocean Uddin](https://www.linkedin.com/in/oceanuddin)
- **Support**: [PayPal Donation](https://paypal.me/uddinocean)
- **Project**: [GitHub Repository](https://github.com/oceanuddin/scamchecker)

---

**⭐ Star this repository if you find it helpful!**

**🛡️ Stay safe online with AI-powered scam detection!**
