# Afrikunle — Multilingual Python Learning (Starter Monorepo)

This starter lets you ship **mobile (iOS/Android)** and **web (PWA)** from a single codebase using **Expo (React Native + Web)**, plus a **Flask API** backend.

## Contents
- `apps/expo-app` — React Native (Expo) app that also builds for Web
- `backend/flask-api` — Python Flask API with sample `/api/lessons` endpoints
- `packages/i18n` — Shared translation JSON files

## Quick Start

### Prereqs
- Node 18+, npm or yarn
- Python 3.10+
- (Optional) Expo Go app on your phone

### Frontend (Expo: mobile + web)
```bash
cd apps/expo-app
npm install
npm run start         # press `i` for iOS (Mac), `a` for Android, `w` for Web
```
To build web PWA:
```bash
npm run web
```

### Backend (Flask)
```bash
cd backend/flask-api
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
flask --app app run --debug
```
The API will run at `http://127.0.0.1:5000`.

### Configure the Expo app to talk to your API
Edit `apps/expo-app/src/config.ts` and set `API_BASE_URL` to your backend URL.

## Next Steps
- Add Firebase Auth (email/Google/phone) to `apps/expo-app`
- Replace in-memory lessons with a database (Firestore or Postgres)
- Invite collaborators on GitHub; use PRs and issues to coordinate
- Add CI (GitHub Actions) for lint/build/test

Happy building!
