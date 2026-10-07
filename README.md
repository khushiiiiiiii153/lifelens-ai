🧠 LifeLens AI

From messy problems to clear next steps.

LifeLens AI is an AI-powered everyday problem-solving assistant that helps users turn confusing situations into clear understanding, priorities, and practical next steps.

🔗 Live Demo: https://lifelens-ai-9ca3.vercel.app/
💻 GitHub: https://github.com/khushiiiiiiii153/lifelens-ai

---

🌟 Overview

Everyday problems can become overwhelming when multiple thoughts, tasks, and priorities get mixed together.

Whether it is exam preparation, time management, career confusion, task overload, or another everyday challenge, people often know that something needs to change but do not know where to start.

LifeLens AI helps bridge that gap.

Users simply describe what they are dealing with in their own words. LifeLens uses AI to understand the situation and turn it into a structured, practical response.

The core idea:

Tell → Understand → Prioritize → Act

Instead of overwhelming users with more information, LifeLens focuses on helping them understand what to do next.

---

🎯 Problem

People frequently face situations where:

- Multiple problems feel mixed together.
- They are unsure what the actual main issue is.
- They have difficulty deciding what to prioritize.
- They receive information but still do not know what action to take.
- Language can become a barrier when communicating naturally.
- Overthinking can make simple problems feel more complicated.

Many AI tools can answer questions, but users may still need to organize those answers themselves.

LifeLens AI focuses on converting a messy situation into an actionable plan.

---

💡 Solution

LifeLens AI allows users to describe their situation naturally.

The AI analyzes the input and organizes the response into four clear sections:

🔴 Problem

Identifies the main issue in the user's situation.

🧠 Understanding

Explains what is happening and why it may be difficult.

✅ Action Plan

Provides prioritized, numbered steps that the user can actually follow.

💡 Helpful Tip

Provides an additional practical suggestion to help the user move forward.

This creates a simple journey:

Tell
  ↓
Understand
  ↓
Prioritize
  ↓
Act

---

✨ Key Features

🤖 AI-Powered Analysis

Uses Google's Gemini API to analyze natural-language situations and generate structured guidance.

📋 Structured Action Plans

Instead of giving a long generic answer, LifeLens produces clear, numbered next steps.

🌍 Multilingual Support

Users can communicate in:

- English
- Hindi
- Marathi
- Hinglish

💬 Ask Anything

Users can ask follow-up questions and continue exploring their situation.

🕘 History

Previous analyses can be viewed so users can revisit their earlier situations and guidance.

📚 Example Situations

Built-in examples help users quickly understand how LifeLens works.

📱 Responsive Interface

The application is designed to work across desktop and smaller screen sizes.

🎨 Simple User Experience

The interface focuses on clarity rather than unnecessary complexity.

---

🧩 How It Works

Step 1 — Tell

The user describes their situation naturally.

Example:

«"I have exams next week, but I have multiple subjects left and I don't know how to manage my time."»

Step 2 — Understand

LifeLens identifies the main problem and explains the situation.

Step 3 — Prioritize

The AI determines what should be addressed first.

Step 4 — Act

LifeLens generates practical, numbered actions that the user can follow.

---

🛠️ Technology Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

AI

- Google Gemini API
- "@google/genai"

Deployment

- Vercel

Version Control

- Git
- GitHub

---

🏗️ Project Structure

lifelens-ai/
│
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   └── ask/
│   │
│   ├── page.tsx
│   └── ...
│
├── public/
│
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── .gitignore
└── README.md

---

🚀 Getting Started

1. Clone the repository

git clone https://github.com/khushiiiiiiii153/lifelens-ai.git

2. Open the project

cd lifelens-ai

3. Install dependencies

npm install

4. Create environment variables

Create a file named:

.env.local

Add your Gemini API key:

GEMINI_API_KEY=your_gemini_api_key_here

⚠️ Never commit ".env.local" or expose your API key publicly.

5. Start the development server

npm run dev

6. Open the application

Visit:

http://localhost:3000

---

🔐 Environment Variables

LifeLens requires a Gemini API key.

GEMINI_API_KEY=your_gemini_api_key_here

For production deployment, the API key should be stored securely as an environment variable on the hosting platform.

Do not upload API keys to GitHub.

---

🌐 Live Deployment

LifeLens AI is deployed using Vercel.

Live Demo

https://lifelens-ai-9ca3.vercel.app/

Source Code

https://github.com/khushiiiiiiii153/lifelens-ai

---

🔮 Future Improvements

Possible future improvements include:

- 🎤 Voice input
- 📎 More file and image-based inputs
- 🧠 More personalized recommendations
- 📊 Progress tracking
- 🔔 Smart reminders based on action plans
- 👥 Shared plans for collaborative situations
- 🌐 Additional Indian languages
- 📱 Dedicated mobile application
- 🧩 More specialized AI workflows

---

🛡️ Responsible AI

LifeLens AI is designed to provide general everyday guidance and practical suggestions.

It is not a replacement for professional medical, legal, financial, or mental-health advice.

For serious or high-risk situations, users should consult an appropriate qualified professional.

---

🏆 Hackathon Project

LifeLens AI was created as a technology project focused on using AI to improve an everyday experience.

The project explores a simple question:

«What if AI could help people not just understand their problems, but figure out what to do next?»

LifeLens turns:

Messy Situation
      ↓
AI Understanding
      ↓
Priorities
      ↓
Practical Action

---

👩‍💻 Built With

Built with curiosity, AI, and a focus on making everyday problems a little easier to handle.

LifeLens AI — From messy problems to clear next steps. ✨
