import { Platform } from "react-native";

// ⚙️ Local development configuration
// This is your current local IP (found via `ipconfig getifaddr en0`)
const LOCAL_IP = "10.223.50.11"; // ✅ confirmed working IP
const LOCAL_PORT = 5001;
const PROD_API_URL = "https://api.afrikunle.com";

// 🧠 Environment logic
const isProd = process.env.NODE_ENV === "production";

// For development, Expo uses your local IP or .env.local config
const API_URL = isProd
  ? PROD_API_URL
  : Platform.OS === "web"
  ? `http://${LOCAL_IP}:${LOCAL_PORT}`
  : process.env.EXPO_PUBLIC_API_URL || `http://${LOCAL_IP}:${LOCAL_PORT}`;

export { API_URL };

export const logApiConfig = () => {
  console.log("🔗 Afrikunle API URL:", API_URL);
  console.log(isProd ? "🚀 Production Mode" : "💡 Development Mode");
};