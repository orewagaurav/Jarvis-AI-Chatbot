# 🤖 Jarvis AI Chatbot

A web-based AI chatbot inspired by **J.A.R.V.I.S.** from Iron Man, built using **HTML, CSS, JavaScript**, and integrated with **Google's Gemini API** to simulate intelligent and conversational behavior.

# [👀 Live Demo](https://orewagaurav.github.io/Jarvis-AI-Chatbot/)

## 🧠 Features

- 🗨️ Conversational AI experience with JARVIS personality
- 🎯 Uses **Gemini AI API** from Google
- 🧔 Personalized replies addressing the user as "sir" or "Mr. Stark"
- 📜 Scrollable chat history with dynamic updates
- 🔔 Notification sound on response
- 💻 Simple and responsive frontend

---

## 📸 Preview

> *(Insert screenshots here if available)*  
> Or host it on GitHub Pages / Vercel and provide a live demo link.

---

## 📁 Project Structure

Jarvis-AI-Chatbot/
├── index.html       # Main HTML page
├── style.css        # Styling and UI layout
├── script.js        # Chatbot functionality
├── config.js        # API key (local only)
├── .env             # Optional: API key (for backend projects)
├── .gitignore       # Files to ignore in git (like config.js)
└── README.md        # You’re reading it!

---

## ⚙️ Setup Instructions

### 🔐 1. Add Your Gemini API Key

Create a file named `config.js` in the project root:

```js
// config.js
const API_KEY = 'your_google_gemini_api_key_here';