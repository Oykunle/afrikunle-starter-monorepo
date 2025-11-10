import 'dotenv/config';

export default {
  expo: {
    name: "afrikunle-expo",
    slug: "afrikunle-expo",
    version: "0.1.0",
    newArchEnabled: true,
    extra: {
      API_URL: process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5001",
    },
  },
};