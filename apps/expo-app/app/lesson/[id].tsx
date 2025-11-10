import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { API_URL, logApiConfig } from "../../src/config";

console.log("✅ [id].tsx loaded correctly");

type Lang = "en" | "fr";
type Lesson = {
  id?: number | string;
  title?: string;
  body?: string;
  level?: string;
  quiz?: { question?: string; answer?: string };
};

// 🕒 Safe fetch with timeout
function fetchWithTimeout(resource: string, opts: RequestInit = {}, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(resource, { ...opts, signal: controller.signal }).finally(() =>
    clearTimeout(id)
  );
}

export default function LessonScreen() {
  const { id = "1" } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lang, setLang] = useState<Lang>("en"); // 🇬🇧 default English

  // 🧩 Load lesson when language changes
  useEffect(() => {
    logApiConfig();

    async function loadLesson() {
      setLoading(true);
      setErr(null);
      try {
        const url = `${API_URL}/api/lessons/${id}?lang=${lang}`;
        console.log("📡 Fetching:", url);
        const res = await fetchWithTimeout(url);
        const data = await res.json();
        console.log("✅ Received lesson:", data);
        setLesson(data);
      } catch (e: any) {
        console.error("❌ Fetch error:", e);
        setErr(e.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [id, lang]);

  // 🗣️ Speech functions
  const speakText = (text?: string) => {
    if (!text) return;
    try {
      Speech.stop();
      Speech.speak(text, {
        language: lang === "fr" ? "fr-FR" : "en-US",
        pitch: 1.0,
        rate: 1.0,
        onDone: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    } catch (e) {
      Alert.alert("Speech Error", "Speech synthesis failed or unsupported language.");
    }
  };

  const stopSpeech = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // 🌀 Loading screen
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading lesson...</Text>
      </SafeAreaView>
    );
  }

  // ❌ Error or empty state
  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ marginBottom: 8 }}>No lesson found.</Text>
        {err && <Text style={{ color: "crimson", textAlign: "center" }}>{err}</Text>}
        <Button title="Go back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  // 🎓 Main UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          flexGrow: 1,
          justifyContent: "flex-start",
          backgroundColor: "#fafafa",
        }}
      >
        {/* 🌍 Language Switcher */}
        <Text style={{ textAlign: "center", fontSize: 14, color: "#888", marginBottom: 8 }}>
          🌍 Choose your language
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            marginBottom: 25,
          }}
        >
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Button
              title="🇬🇧 English"
              onPress={() => setLang("en")}
              color={lang === "en" ? "#007AFF" : "#8E8E93"}
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Button
              title="🇫🇷 Français"
              onPress={() => setLang("fr")}
              color={lang === "fr" ? "#007AFF" : "#8E8E93"}
            />
          </View>
        </View>

        {/* 🧠 Lesson Title & Body */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#222",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {lesson.title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#444",
            marginBottom: 20,
            lineHeight: 24,
            textAlign: "justify",
          }}
        >
          {lesson.body}
        </Text>

        {/* 🔊 Voice Controls */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 25, justifyContent: "center" }}>
          <Button
            title={isSpeaking ? "🔁 Replay" : "🔊 Read Aloud"}
            onPress={() => speakText(lesson.body)}
          />
          <Button title="⏹ Stop" onPress={stopSpeech} color="#FF3B30" />
        </View>

        {/* 🧩 Quiz Section */}
        {lesson.quiz && (
          <View
            style={{
              backgroundColor: "#f2f2f2",
              padding: 15,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 5 }}>Quiz:</Text>
            <Text>{lesson.quiz.question}</Text>
            <Text style={{ color: "#007AFF", marginTop: 5 }}>👉 {lesson.quiz.answer}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}