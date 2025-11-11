import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Animated,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../src/config";
import { LightTheme, DarkTheme } from "../src/theme";

export default function PythonShell() {
  const [code, setCode] = useState("print('Hello, Afrikunle!')");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "fr" | "ba">("en");
  const [darkMode, setDarkMode] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const Colors = darkMode ? DarkTheme : LightTheme;

  // 🌍 Texts
  const text = {
    en: {
      welcome: "Welcome to Afrikunle 🧠",
      subtitle: "Learn and run Python in your own language!",
      title: "🐍 Python Shell",
      description: "Type your Python code below and press Run.",
      run: "▶ Run Code",
      running: "Running...",
      output: "Output",
      error: "⚠️ Error connecting to the server.",
      read: "🔊 Read Aloud",
      stop: "⏹ Stop",
      mode: "Dark Mode",
      offline: "⚙️ You’re offline — showing saved output.",
    },
    fr: {
      welcome: "Bienvenue sur Afrikunle 🧠",
      subtitle: "Apprends et exécute du Python dans ta propre langue !",
      title: "🐍 Shell Python",
      description: "Tape ton code Python ci-dessous et appuie sur « Exécuter ».",
      run: "▶ Exécuter le code",
      running: "Exécution...",
      output: "Résultat",
      error: "⚠️ Erreur de connexion au serveur.",
      read: "🔊 Lire à voix haute",
      stop: "⏹ Arrêter",
      mode: "Mode sombre",
      offline: "⚙️ Mode hors ligne — affichage du dernier résultat enregistré.",
    },
    ba: {
      welcome: "Akwaba na Afrikunle 🧠",
      subtitle: "Bɛ́ni Python kɔ ni ɔ bôlɛ Baoulé lɛ!",
      title: "🐍 Python Kɛli",
      description: "Wɔhɔ Python kɛli kɔ ni, dya Run bɔ.",
      run: "▶ Sɛn kɛli",
      running: "Sɛn...",
      output: "Bɔfɔ",
      error: "⚠️ Bôli mɛ́ bɔ na serveur.",
      read: "🔊 Kɛli bɔ nyɔ",
      stop: "⏹ Tɔbɛ",
      mode: "Fɛ́n nyɔ mode",
      offline: "⚙️ Fɛ́n offline — sɛn bɔfɔ bɛ ni dya nyɔ.",
    },
  };

  const t = text[lang];

  // 🧠 Load saved data
  useEffect(() => {
    (async () => {
      try {
        const [savedLang, savedTheme, savedCode, savedOutput] = await Promise.all([
          AsyncStorage.getItem("lang"),
          AsyncStorage.getItem("darkMode"),
          AsyncStorage.getItem("lastCode"),
          AsyncStorage.getItem("lastOutput"),
        ]);

        if (savedLang) setLang(savedLang as "en" | "fr" | "ba");
        if (savedTheme) setDarkMode(savedTheme === "true");
        if (savedCode) setCode(savedCode);
        if (savedOutput) setOutput(savedOutput);
      } catch (err) {
        console.warn("⚠️ Failed to load saved data:", err);
      }
    })();
  }, []);

  // 💾 Auto-save changes
  useEffect(() => {
    AsyncStorage.setItem("lang", lang);
    AsyncStorage.setItem("darkMode", darkMode.toString());
    AsyncStorage.setItem("lastCode", code);
    AsyncStorage.setItem("lastOutput", output);
  }, [lang, darkMode, code, output]);

  // 🎬 Fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => fadeAnim.setValue(0));
  }, [darkMode]);

  // 🧩 Run Python Code
  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch(`${API_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setOutput(data.output || "No output");
    } catch {
      Alert.alert(t.offline);
      const saved = await AsyncStorage.getItem("lastOutput");
      if (saved) setOutput(saved);
      else setOutput(t.error);
    } finally {
      setLoading(false);
    }
  };

  // 🎙️ Voice System
  const handleSpeak = async () => {
    const textToSpeak = `${t.output}: ${output || code}`;
    try {
      if (Platform.OS === "web") {
        const synth = window.speechSynthesis;
        synth.cancel();
        await new Promise((resolve) => setTimeout(resolve, 300));
        let voices = synth.getVoices();
        if (!voices.length) synth.onvoiceschanged = () => (voices = synth.getVoices());
        const langCode = lang === "ba" ? "fr-FR" : lang === "fr" ? "fr-FR" : "en-US";
        const selectedVoice =
          voices.find((v) => v.lang.startsWith(langCode)) ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0];
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        utter.voice = selectedVoice;
        utter.lang = langCode;
        utter.rate = lang === "ba" ? 0.75 : lang === "fr" ? 0.85 : 0.95;
        utter.pitch = 1.0;
        synth.speak(utter);
      } else {
        const voices = await Speech.getAvailableVoicesAsync();
        const langCode = lang === "ba" ? "fr-FR" : lang === "fr" ? "fr-FR" : "en-US";
        const matchedVoice = voices.find((v) =>
          v.language.toLowerCase().startsWith(langCode.toLowerCase())
        );
        Speech.stop();
        Speech.speak(textToSpeak, {
          language: matchedVoice?.language || langCode,
          pitch: 1.0,
          rate: lang === "ba" ? 0.75 : lang === "fr" ? 0.85 : 0.95,
          voice: matchedVoice?.identifier,
        });
      }
    } catch (err) {
      console.warn("🗣️ Voice Error:", err);
    }
  };

  const handleStop = () => {
    if (Platform.OS === "web") window.speechSynthesis.cancel();
    else Speech.stop();
  };

  // 💡 UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, padding: 20 }}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: fadeAnim,
          backgroundColor: darkMode ? "#000" : "#fff",
        }}
      />
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 25 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={{ uri: "https://i.ibb.co/dtZbYgD/afrikunle-logo.png" }}
            style={{ width: 35, height: 35, borderRadius: 8 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "700", color: Colors.text }}>Afrikunle</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{ color: Colors.muted }}>{t.mode}</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? Colors.primary : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: Colors.secondary }}
          />
        </View>
      </View>

      {/* Languages */}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        {[
          { key: "en", label: "🇬🇧 English" },
          { key: "fr", label: "🇫🇷 Français" },
          { key: "ba", label: "🇨🇮 Baoulé" },
        ].map((lng) => (
          <TouchableOpacity
            key={lng.key}
            onPress={() => setLang(lng.key as "en" | "fr" | "ba")}
            style={{
              backgroundColor: lang === lng.key ? Colors.primary : Colors.card,
              borderColor: Colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: lang === lng.key ? "#fff" : Colors.text, fontWeight: "600" }}>
              {lng.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Code Editor */}
      <View style={{ backgroundColor: Colors.card, padding: 15, borderRadius: 12, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: Colors.text }}>
          {t.title}
        </Text>
        <Text style={{ color: Colors.muted, marginBottom: 10 }}>{t.description}</Text>

        <TextInput
          multiline
          style={{
            borderColor: Colors.border,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            height: 140,
            textAlignVertical: "top",
            fontFamily: "Courier",
            backgroundColor: Colors.background,
            color: Colors.text,
          }}
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity
          onPress={runCode}
          disabled={loading}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 10,
            paddingVertical: 12,
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            {loading ? t.running : t.run}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Output Section */}
      <View style={{ backgroundColor: Colors.card, padding: 15, borderRadius: 12 }}>
        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 5, color: Colors.text }}>
          {t.output}:
        </Text>
        <ScrollView
          style={{
            maxHeight: 160,
            borderColor: Colors.border,
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            backgroundColor: Colors.background,
          }}
        >
          <Text style={{ fontFamily: "Courier", color: Colors.text }}>{output}</Text>
        </ScrollView>

        {/* Voice Controls */}
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 15 }}>
          <TouchableOpacity
            onPress={handleSpeak}
            style={{
              backgroundColor: Colors.secondary,
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>{t.read}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleStop}
            style={{
              backgroundColor: Colors.danger,
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>{t.stop}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}