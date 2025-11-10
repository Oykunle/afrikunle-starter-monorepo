import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { API_URL, logApiConfig } from "@/src/config";

type Lang = "en" | "fr";
type Lesson = {
  id?: number | string;
  title?: string;
  body?: string;
  level?: string;
  quiz?: { question?: string; answer?: string };
};

// ⏱️ Helper for timeout-safe fetch
function fetchWithTimeout(resource: string, opts: RequestInit = {}, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(resource, { ...opts, signal: controller.signal }).finally(() => clearTimeout(id));
}

export default function LessonScreen() {
  const { id = "1", lang = "en" } = useLocalSearchParams<{ id?: string; lang?: Lang }>();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    logApiConfig();

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        const urls = [
          `${API_URL}/api/lessons/${id}?lang=${lang}`,
          `${API_URL}/api/lessons?lang=${lang}`,
          `${API_URL}/api/lesson/${id}?lang=${lang}`,
          `${API_URL}/api/lesson?lang=${lang}`,
        ];

        let data: any | null = null;
        for (const url of urls) {
          console.log("📡 Trying:", url);
          try {
            const res = await fetchWithTimeout(url, {}, 8000);
            console.log("↩️ Status:", res.status, "for", url);
            if (!res.ok) continue;
            data = await res.json();
            console.log("✅ Parsed JSON from", url, data);
            break;
          } catch (e) {
            console.log("⏳ Request failed/aborted for", url, e);
          }
        }

        if (!data) throw new Error("No endpoint returned data");

        const current: Lesson = Array.isArray(data) ? data[0] : data;
        if (!current || (!current.title && !current.body))
          throw new Error("Unexpected lesson data structure");

        setLesson(current);
      } catch (e: any) {
        console.error("❌ Lesson fetch error:", e?.message || e);
        setErr(e?.message || "Failed to load lesson");
        Alert.alert("Error", "Could not load lesson details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, lang]);

  const speakText = (text?: string) => {
    if (!text) return;
    try {
      Speech.stop();
      Speech.speak(text, {
        language: (lang as Lang) === "fr" ? "fr-FR" : "en-US",
        pitch: 1.0,
        rate: 1.0,
      });
      setIsSpeaking(true);
    } catch (e) {
      console.error("Speech error:", e);
      Alert.alert("Speech Error", "This language may not be supported on your device.");
    }
  };

  const stopSpeech = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading lesson...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ marginBottom: 8 }}>No lesson found.</Text>
        {err ? <Text style={{ color: "crimson", textAlign: "center" }}>{err}</Text> : null}
        <Button title="Go back" onPress={() => router.back()} />
      </View>
    );
  }

  const title = lesson.title || "Lesson";
  const body = lesson.body || "";
  const quiz = lesson.quiz;

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>{title}</Text>
      <Text style={{ fontSize: 16, color: "#333", marginBottom: 20 }}>{body}</Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <Button title={isSpeaking ? "🔁 Replay" : "🔊 Read Aloud"} onPress={() => speakText(body)} />
        <Button title="⏹ Stop" onPress={stopSpeech} color="#FF3B30" />
      </View>

      {quiz && (
        <View style={{ backgroundColor: "#f2f2f2", padding: 15, borderRadius: 10, marginTop: 10 }}>
          <Text style={{ fontWeight: "600", marginBottom: 5 }}>Quiz:</Text>
          <Text>{quiz.question}</Text>
          <Text style={{ color: "#007AFF", marginTop: 5 }}>👉 {quiz.answer}</Text>
        </View>
      )}

      <Button title="← Back to Lessons" onPress={() => router.push("/")} />
    </ScrollView>
  );
}