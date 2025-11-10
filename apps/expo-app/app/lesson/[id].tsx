import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LessonDetail() {
  const { id, level } = useLocalSearchParams();
  const [lesson, setLesson] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [speechRate, setSpeechRate] = useState(0.95);
  const [autoSpoken, setAutoSpoken] = useState(false);
  const [userName, setUserName] = useState("Student");

  // 🧠 Load preferences (name, language, speech rate)
  useEffect(() => {
    const loadPreferences = async () => {
      const savedLang = await AsyncStorage.getItem("preferredLang");
      const savedRate = await AsyncStorage.getItem("speechRate");
      const savedName = await AsyncStorage.getItem("userName");

      if (savedLang === "fr" || savedLang === "en") setLang(savedLang);
      if (savedRate) setSpeechRate(parseFloat(savedRate));
      if (savedName) setUserName(savedName);
    };
    loadPreferences();
  }, []);

  // 🌍 Fetch lesson
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://10.222.234.35:5001/api/lessons/${id}?lang=${lang}`);
        const data = await res.json();
        setLesson(data);
        setCode(data.quiz?.answer || "");
        setAutoSpoken(false);
      } catch (err) {
        console.error("❌ Error fetching lesson:", err);
        Alert.alert("Connection Error", "Could not load the lesson from Afrikunle server.");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id, lang]);

  // 🧏🏾 Afrikunle voice tutor introduction
  useEffect(() => {
    if (lesson && !autoSpoken) {
      const introEn = `Welcome back, ${userName}! Today’s lesson is ${lesson.title?.en || lesson.title}. Let’s learn something new together.`;
      const introFr = `Bon retour, ${userName}! La leçon d’aujourd’hui est ${lesson.title?.fr || lesson.title}. Apprenons quelque chose de nouveau ensemble.`;

      const introText = lang === "fr" ? introFr : introEn;
      Speech.stop();
      Speech.speak(introText, {
        language: lang === "fr" ? "fr-FR" : "en-US",
        rate: speechRate,
        pitch: 1.0,
        voice: lang === "en" ? "com.apple.ttsbundle.Samantha-compact" : "com.apple.ttsbundle.Thomas-compact",
      });

      setTimeout(() => {
        const introBody =
          (lesson.body?.[lang] || lesson.body)?.split(". ").slice(0, 2).join(". ") + ".";
        Speech.speak(introBody, {
          language: lang === "fr" ? "fr-FR" : "en-US",
          rate: speechRate,
          pitch: 1.05,
        });
      }, 3500);

      setAutoSpoken(true);
    }
  }, [lesson, lang]);

  // ▶️ Run Python code
  const handleRunCode = async () => {
    setOutput("⏳ Running...");
    try {
      const res = await fetch("http://10.222.234.35:5001/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || "✅ Done!");
    } catch (err) {
      console.error("❌ Error running code:", err);
      setOutput("🚫 Unable to connect to Afrikunle server.");
    }
  };

  // 🌍 Switch language
  const toggleLang = async () => {
    const newLang = lang === "en" ? "fr" : "en";
    setLang(newLang);
    await AsyncStorage.setItem("preferredLang", newLang);
    Speech.stop();
  };

  // 🔊 Speak entire lesson
  const speakLesson = () => {
    if (!lesson) return;
    Speech.stop();
    const textToSpeak =
      (lesson.title?.[lang] || lesson.title) + ". " + (lesson.body?.[lang] || lesson.body);
    Speech.speak(textToSpeak, {
      language: lang === "en" ? "en-US" : "fr-FR",
      rate: speechRate,
      pitch: 1.0,
    });
  };

  // 🛑 Stop reading
  const stopSpeaking = () => Speech.stop();

  // 🎚 Voice speed
  const changeSpeed = async (rate: number) => {
    setSpeechRate(rate);
    await AsyncStorage.setItem("speechRate", String(rate));
    Alert.alert(
      "Voice Speed Updated",
      `Afrikunle will now speak in ${rate === 0.8 ? "🐢 slow" : rate === 0.95 ? "⚖️ normal" : "⚡ fast"} mode.`
    );
  };

  // 👤 Prompt name saving (future onboarding)
  const saveName = async (newName: string) => {
    setUserName(newName);
    await AsyncStorage.setItem("userName", newName);
  };

  // 🌀 Loading
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading your lesson...</Text>
      </View>
    );

  if (!lesson)
    return (
      <View style={styles.center}>
        <Text>Lesson not found 😔</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.levelTag}>Level: {level || lesson.level || "Beginner"}</Text>
      <Text style={styles.title}>{lesson.title?.[lang] || lesson.title}</Text>
      <Text style={styles.body}>{lesson.body?.[lang] || lesson.body}</Text>

      <View style={styles.quizSection}>
        <Text style={styles.quizQ}>{lesson.quiz?.question?.[lang] || lesson.quiz?.question}</Text>
        <Text style={styles.quizA}>👉 {lesson.quiz?.answer}</Text>
      </View>

      {/* 🎧 Voice & Language Controls */}
      <View style={styles.speakBox}>
        <Button
          title={lang === "en" ? "Passer en français 🇫🇷" : "Switch to English 🇬🇧"}
          onPress={toggleLang}
          color="#007AFF"
        />
        <View style={{ marginTop: 10 }}>
          <Button
            title={lang === "en" ? "🔊 Listen to Lesson" : "🔊 Écouter la leçon"}
            color="#FF9800"
            onPress={speakLesson}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button title="🛑 Stop Reading" color="#E53935" onPress={stopSpeaking} />
        </View>
      </View>

      {/* 🎚 Voice Speed */}
      <View style={styles.speedBox}>
        <Text style={styles.speedTitle}>Voice Speed:</Text>
        <View style={styles.speedButtons}>
          <TouchableOpacity onPress={() => changeSpeed(0.8)} style={styles.speedButton}>
            <Text>🐢</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeSpeed(0.95)} style={styles.speedButton}>
            <Text>⚖️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeSpeed(1.2)} style={styles.speedButton}>
            <Text>⚡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 💻 Python Playground */}
      <View style={styles.playground}>
        <Text style={styles.playTitle}>🧠 Try it yourself</Text>
        <TextInput
          multiline
          numberOfLines={6}
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder={lang === "en" ? "Type your Python code here..." : "Tape ton code Python ici..."}
        />
        <Button title="▶ Run Code" onPress={handleRunCode} color="#28A745" />

        {output && (
          <View style={styles.outputBox}>
            <Text style={styles.outputText}>Result:</Text>
            <Text style={{ fontFamily: "monospace" }}>{output}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  levelTag: { fontSize: 14, fontWeight: "600", color: "#007AFF", marginBottom: 5 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#222" },
  body: { fontSize: 16, marginBottom: 15, lineHeight: 22, color: "#444" },
  quizSection: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  quizQ: { fontWeight: "600", marginBottom: 5 },
  quizA: { color: "#007AFF", fontFamily: "monospace" },
  speakBox: { marginBottom: 20 },
  speedBox: { marginBottom: 20, alignItems: "center" },
  speedTitle: { fontWeight: "bold", marginBottom: 5 },
  speedButtons: { flexDirection: "row", gap: 10 },
  speedButton: { padding: 10, backgroundColor: "#f2f2f2", borderRadius: 10 },
  playground: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  playTitle: { fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontFamily: "monospace",
    minHeight: 120,
  },
  outputBox: {
    backgroundColor: "#E8F8E8",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  outputText: { fontWeight: "bold", marginBottom: 5, color: "#28A745" },
});