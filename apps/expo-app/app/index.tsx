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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { API_URL } from "../src/config";
import { LightTheme, DarkTheme } from "../src/theme";

export default function PythonShell() {
  const [code, setCode] = useState("print('Hello, Afrikunle!')");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [darkMode, setDarkMode] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);

  const Colors = darkMode ? DarkTheme : LightTheme;

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
    },
  };
  const t = text[lang];

  // 🧩 Load settings (theme + language)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedLang = await AsyncStorage.getItem("lang");
        const storedTheme = await AsyncStorage.getItem("darkMode");

        if (storedLang) {
          setLang(storedLang as "en" | "fr");
        } else {
          // 🌍 Auto-detect system language
          const deviceLang = Localization.locale.startsWith("fr") ? "fr" : "en";
          setLang(deviceLang);
          await AsyncStorage.setItem("lang", deviceLang);
        }

        if (storedTheme) setDarkMode(storedTheme === "true");
      } catch (err) {
        console.warn("⚠️ Failed to load saved settings:", err);
      }
    };
    loadSettings();
  }, []);

  // 💾 Save settings whenever they change
  useEffect(() => {
    AsyncStorage.setItem("lang", lang);
    AsyncStorage.setItem("darkMode", darkMode.toString());
  }, [lang, darkMode]);

  // 🎬 Animate theme change
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => fadeAnim.setValue(0));
  }, [darkMode]);

  // 🔍 Load available voices
  useEffect(() => {
    if (Platform.OS === "web") {
      const synth = window.speechSynthesis;
      const updateVoices = () => setAvailableVoices(synth.getVoices());
      synth.onvoiceschanged = updateVoices;
      updateVoices();
    } else {
      Speech.getAvailableVoicesAsync().then(setAvailableVoices);
    }
  }, []);

  // 🧠 Python Execution
  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch(`${API_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (err) {
      setOutput(t.error);
    } finally {
      setLoading(false);
    }
  };

  // 🗣️ Voice Controls (auto voice matching)
  const handleSpeak = async () => {
    try {
      const textToSpeak = `${t.output}: ${output || code}`;

      if (Platform.OS === "web") {
        const synth = window.speechSynthesis;
        const voice =
          availableVoices.find((v) =>
            v.lang.toLowerCase().startsWith(lang === "fr" ? "fr" : "en")
          ) || availableVoices[0];

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.voice = voice;
        utterance.lang = lang === "fr" ? "fr-FR" : "en-US";
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        synth.cancel();
        synth.speak(utterance);
      } else {
        const voices = await Speech.getAvailableVoicesAsync();
        const match = voices.find((v) =>
          v.language.toLowerCase().startsWith(lang === "fr" ? "fr" : "en")
        );

        const langCode = match ? match.language : lang === "fr" ? "fr-FR" : "en-US";
        Speech.stop();
        Speech.speak(textToSpeak, {
          language: langCode,
          pitch: 1.0,
          rate: 0.8,
        });
      }
    } catch (error) {
      console.warn("🗣️ Speech error:", error);
    }
  };

  const handleStop = () => {
    if (Platform.OS === "web") {
      window.speechSynthesis.cancel();
    } else {
      Speech.stop();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, padding: 20 }}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: fadeAnim,
          backgroundColor: darkMode ? "#000" : "#fff",
        }}
      />

      {/* 🧠 Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 25,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={{
              uri: "https://i.ibb.co/dtZbYgD/afrikunle-logo.png",
            }}
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

      {/* 🌍 Language Switch */}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        {["en", "fr"].map((lng) => (
          <TouchableOpacity
            key={lng}
            onPress={() => setLang(lng as "en" | "fr")}
            style={{
              backgroundColor: lang === lng ? Colors.primary : Colors.card,
              borderColor: Colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: lang === lng ? "#fff" : Colors.text,
                fontWeight: "600",
              }}
            >
              {lng === "en" ? "🇬🇧 English" : "🇫🇷 Français"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 25 }}>
        <Text style={{ fontSize: 26, fontWeight: "bold", color: Colors.text }}>{t.welcome}</Text>
        <Text style={{ fontSize: 16, color: Colors.muted, marginTop: 5, textAlign: "center" }}>
          {t.subtitle}
        </Text>
      </View>

      {/* Code Editor */}
      <View
        style={{
          backgroundColor: Colors.card,
          padding: 15,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          marginBottom: 20,
        }}
      >
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

      {/* Output */}
      <View
        style={{
          backgroundColor: Colors.card,
          padding: 15,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}
      >
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

        {/* Voice Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 15,
          }}
        >
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