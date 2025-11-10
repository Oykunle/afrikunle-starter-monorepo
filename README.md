# 🧠 Afrikunle — Learn to Code in Your Own Language  
> _“If you can think in your language, you can code in your language.”_

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/Oykunle/afrikunle-starter-monorepo?label=Latest%20Release&color=blue)](https://github.com/Oykunle/afrikunle-starter-monorepo/releases/latest)
[![Made with Expo](https://img.shields.io/badge/Expo-SDK%2052-black?logo=expo&logoColor=white)](https://expo.dev/)
[![Backend Flask](https://img.shields.io/badge/Backend-Flask-lightgrey?logo=flask&logoColor=black)](https://flask.palletsprojects.com/)
[![Built with TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.9-61DAFB?logo=react)](https://reactnative.dev/)

---

## 🌍 Vision
Afrikunle is a learning platform that helps people **learn Python in their own languages.**  
Our mission is to make programming accessible and inclusive — breaking the English barrier in coding education.

**Languages supported:**  
🇬🇧 English • 🇫🇷 French  
_(Yorùbá, Swahili, Baoulé, Bambara, Hausa, and other world languages coming soon 🧩)_

---

## ✨ Features
- 🧩 **Multilingual Lessons:** Instantly switch between English and French  
- 🗣️ **Voice Tutor:** Listen to lessons aloud using Expo Speech  
- ⚡ **Live Python Backend:** Flask API delivers real lesson data  
- 💻 **Device Flexibility:** Works on Android, Web, and iOS (via Expo Go)  
- ⚙️ **Environment Config:** `.env.local` for flexible API URLs  
- 🎯 **Tested Setup:** Fully working connection between Expo frontend and Flask backend  

---

## 🧰 Tech Stack
| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | Expo (React Native SDK 52) | Interactive mobile app |
| **Backend** | Flask (Python) | Lesson API + Code Execution (future) |
| **Language** | TypeScript | Strong typing and scalability |
| **Speech Engine** | Expo Speech | Reads lessons aloud |
| **Storage** | AsyncStorage | Saves user preferences locally |

---

## 📘 Latest Release — [v1.0.0](https://github.com/Oykunle/afrikunle-starter-monorepo/releases/tag/v1.0.0)
### 🚀 Afrikunle v1.0.0 — Stable Foundation Release

This marks the **first functional version** of Afrikunle — connecting the Flask API with the Expo app, featuring live data, voice playback, and multilingual support.

#### 🔹 Highlights
- ✅ Flask backend responding with dynamic lesson data  
- ✅ Working React Native front-end connected to API  
- ✅ Voice reading integration using Expo Speech  
- ✅ `.env.local` environment setup for multi-device use  
- ✅ Multilingual support (English + French)  

🔗 **[Full Changelog →](https://github.com/Oykunle/afrikunle-starter-monorepo/commits/v1.0.0)**

---

## 🧩 Project Structure

afrikunle-starter-monorepo/
│
├── apps/
│   └── expo-app/              # React Native (Expo) app
│       ├── app/               # Screens and routes
│       ├── src/               # Shared config and utilities
│       └── .env.local         # Local API URL
│
├── backend/
│   └── flask-api/             # Python Flask backend
│       ├── app.py             # API entrypoint
│       └── requirements.txt   # Dependencies
│
└── packages/
└── i18n/                  # Translations (English/French + future African languages)

    

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Oykunle/afrikunle-starter-monorepo.git
cd afrikunle-starter-monorepo

2️⃣ Run the Backend (Flask)

cd backend/flask-api
pip install -r requirements.txt
flask --app app run --host=0.0.0.0 --port=5001

3️⃣ Run the Frontend (Expo)

cd apps/expo-app
npm install
npx expo start -c

💡 Tip: Update .env.local in the Expo app:

EXPO_PUBLIC_API_URL=http://YOUR_IP:5001



	8.	📈 Roadmap
Version                                         Milestone                                                                                   Status
v1.0.0
Stable                          foundation (Flask + Expo + Voice)                                                                           ✅ Done
v1.1.0                       UI improvements, lesson navigation, cloud deployment                                                        🧩 In progress
v2.0.0                       Add interactive coding exercises + more languages                                                             🚀 Planned




👨🏽‍💻 Author

Oyekunle “Oye” Alabi
🎓 Computer Science | Cybersecurity & Software Design
Ball State University


💬 Contribute

Afrikunle is open for collaboration!
If you believe coding should be accessible to everyone —
join the mission to bring programming education in every language.


© 2025 Afrikunle Project — Built with ❤️ by Oye








