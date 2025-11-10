import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { Stack } from "expo-router";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
import useApiHealth from "../hooks/useApiHealth";

export default function Layout() {
  const isOnline = useApiHealth(EXPO_PUBLIC_API_URL);

  // 🌀 Animation references
  const translateY = useRef(new Animated.Value(-60)).current; // start hidden
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: isOnline ? 0 : -60, // slide in/out
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isOnline ? 1 : 0,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOnline]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🟢 Animated Afrikunle API banner */}
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          backgroundColor: isOnline ? "#28A745" : "#DC3545",
          paddingVertical: 10,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 5,
          elevation: 3,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 15,
          }}
        >
          {isOnline
            ? "🟢 Connected to Afrikunle API"
            : "🔴 Offline — Reconnecting..."}
        </Text>
      </Animated.View>

      {/* 📱 All other screens render here */}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}