// Firebase configuration for Afrikunle app
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAV0GFG6-8VniyKbVBbo7ALXD1nu3JjSDg",
  authDomain: "afrikunle-6038c.firebaseapp.com",
  projectId: "afrikunle-6038c",
  storageBucket: "afrikunle-6038c.firebasestorage.app",
  messagingSenderId: "1071434126537",
  appId: "1:1071434126537:web:ead2921dbc1fefc1586918",
};

// ✅ Prevent multiple initializations during hot-reloads
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();