require('dotenv').config();
const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const app = express();

// --- ABSOLUTE FIRST: CORS HANDLER ---
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://scamchecker-beta.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
// -------------------------------------

app.use(express.json());
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Text scenario endpoint
app.post('/api/check-scam', async (req, res) => {
  const { scenario } = req.body;
  if (!scenario) return res.status(400).json({ error: 'No scenario provided' });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a cybersecurity AI specialized in detecting phishing, scam, and fraud attempts in emails, messages, and websites. Analyze the provided text or screenshot for potential scam indicators — even if the message appears professional or realistic.

Focus especially on the following red flags:

Suspicious URLs (e.g., misspelled domains, lookalikes like boa-alert.com instead of bankofamerica.com)

Urgency or Threats (e.g., "Act now or your account will be locked")

Requests for sensitive info (login credentials, SSN, bank details, etc.)

Mismatched sender info (display name vs actual domain)

Unusual grammar or formatting

Spoofed branding (legitimate logos or layout with fake links)

Your job is to classify the message as "Scam," "Safe," or "Unclear", and provide a confidence score.

Be conservative: if any scam indicators are present, lean toward "Scam" unless proven otherwise.

Also include a list of specific red flags, and actionable steps for users to verify legitimacy.

Return a JSON object with the following fields:
- verdict: string (e.g., "This is likely a SCAM", "This is likely SAFE", "Unclear")
- confidence: string (MUST include percentage, e.g., "High (93%)", "Medium (70%)", "Low (55%)")
- redFlags: array of strings (each a red flag found)
- actions: array of objects with { title: string, description: string }
- analysis: string (a paragraph summary of your reasoning)

IMPORTANT: Always include a confidence percentage in the confidence field. Respond ONLY with valid JSON.`
        },
        {
          role: 'user',
          content: `Is this a scam? Please analyze and return the JSON as described: ${scenario}`
        }
      ],
      max_tokens: 700
    });

    // Try to parse the JSON from the AI's response
    let data;
    try {
      const match = response.choices[0].message.content.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : { analysis: response.choices[0].message.content };
      
      // Ensure confidence has a percentage if missing
      if (data.confidence && !data.confidence.includes('%')) {
        data.confidence = `${data.confidence} (85%)`;
      }
    } catch (e) {
      data = { analysis: response.choices[0].message.content };
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Image upload endpoint with OpenAI Vision
app.post('/api/check-scam-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const imagePath = path.join(__dirname, req.file.path);
    const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

    // Instruct the AI to return structured JSON
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a cybersecurity AI specialized in detecting phishing, scam, and fraud attempts in emails, messages, and websites. Analyze the provided text or screenshot for potential scam indicators — even if the message appears professional or realistic.

Focus especially on the following red flags:

Suspicious URLs (e.g., misspelled domains, lookalikes like boa-alert.com instead of bankofamerica.com)

Urgency or Threats (e.g., "Act now or your account will be locked")

Requests for sensitive info (login credentials, SSN, bank details, etc.)

Mismatched sender info (display name vs actual domain)

Unusual grammar or formatting

Spoofed branding (legitimate logos or layout with fake links)

Your job is to classify the message as "Scam," "Safe," or "Unclear", and provide a confidence score.

Be conservative: if any scam indicators are present, lean toward "Scam" unless proven otherwise.

Also include a list of specific red flags, and actionable steps for users to verify legitimacy.

Return a JSON object with the following fields:
- verdict: string (e.g., "This is likely a SCAM", "This is likely SAFE", "Unclear")
- confidence: string (MUST include percentage, e.g., "High (93%)", "Medium (70%)", "Low (55%)")
- redFlags: array of strings (each a red flag found)
- actions: array of objects with { title: string, description: string }
- analysis: string (a paragraph summary of your reasoning)

IMPORTANT: Always include a confidence percentage in the confidence field. Respond ONLY with valid JSON.`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Is this image a scam? Please analyze and return the JSON as described.' },
            {
              type: 'image_url',
              image_url: {
                url: `data:${req.file.mimetype};base64,${imageData}`
              }
            }
          ]
        }
      ],
      max_tokens: 700
    });

    fs.unlinkSync(imagePath);

    // Try to parse the JSON from the AI's response
    let data;
    try {
      // Find the first JSON block in the response
      const match = response.choices[0].message.content.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : { analysis: response.choices[0].message.content };
      
      // Ensure confidence has a percentage if missing
      if (data.confidence && !data.confidence.includes('%')) {
        data.confidence = `${data.confidence} (85%)`;
      }
    } catch (e) {
      data = { analysis: response.choices[0].message.content };
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 