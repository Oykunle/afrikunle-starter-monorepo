// 🌍 Centralized environment configuration for Afrikunle

export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.222.234.35:5001";

// ✅ Debug helper
export function logApiConfig() {
  console.log("🔗 Afrikunle API URL:", API_URL);
}