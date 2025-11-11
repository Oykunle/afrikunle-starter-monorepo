import { Platform } from "react-native";

// ✅ Your local Flask IP (make sure it matches your terminal output)
const LOCAL_IP = "10.222.234.35";
const LOCAL_PORT = 5001;

// 🌍 Production API placeholder (for later deployment)
const PROD_API_URL = "https://api.afrikunle.com";

// 🧠 Choose environment automatically
const isProd = process.env.NODE_ENV === "production";

// 👇 Final dynamic URL (works for web + Android + iOS)
export const API_URL = isProd
  ? PROD_API_URL
  : Platform.select({
      web: `http://${LOCAL_IP}:${LOCAL_PORT}`,
      android: `http://${LOCAL_IP}:${LOCAL_PORT}`,
      ios: `http://${LOCAL_IP}:${LOCAL_PORT}`,
      default: `http://${LOCAL_IP}:${LOCAL_PORT}`,
    });

export const logApiConfig = () => {
  console.log("🔗 Afrikunle API URL:", API_URL);
  console.log(isProd ? "🚀 Production Mode" : "💡 Development Mode");
};