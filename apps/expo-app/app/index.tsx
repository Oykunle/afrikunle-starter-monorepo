import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router"; // ✅ Added navigation support

// Mock available levels
const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
type Level = typeof LEVELS[number];

export default function Lessons() {
  const router = useRouter(); // ✅ Initialize router for navigation
  const [lessons, setLessons] = useState<any[]>([]);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [level, setLevel] = useState<Level>("Beginner");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("http://10.222.234.35:5001/api/lessons");; // ✅ Use your IP + backend port
        const data = await res.json();
        setLessons(data);
      } catch (error) {
        console.error("❌ Error fetching lessons:", error);
        Alert.alert("Connection Error", "Could not fetch lessons from the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // 🎓 Filter lessons by selected level
  const filteredLessons = lessons.filter(
    (lesson) => !lesson.level || lesson.level === level
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading lessons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🌍 Language Header */}
      <Text style={styles.header}>
        Afrikunle Lessons ({lang === "en" ? "English" : "Français"})
      </Text>

      {/* 🔁 Language Toggle */}
      <Button
        title={lang === "en" ? "Switch to French" : "Passer en anglais"}
        onPress={() => setLang(lang === "en" ? "fr" : "en")}
      />

      {/* 🎓 Level Selector */}
      <View style={styles.levelContainer}>
        {LEVELS.map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.levelButton, level === l && styles.levelButtonActive]}
            onPress={() => {
              setLevel(l);
              Alert.alert(
                "Level Changed",
                l === "Beginner"
                  ? "Learning Python as if you were 10 years old 👶🏾!"
                  : l === "Intermediate"
                  ? "Now we’re thinking like a real programmer 👩🏾‍💻"
                  : "Deep dive — you’re now coding like a pro ⚡️"
              );
            }}
          >
            <Text
              style={[
                styles.levelText,
                level === l && styles.levelTextActive,
              ]}
            >
              {l}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🧠 Lessons List */}
      <FlatList
        data={filteredLessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: `/lesson/${item.id}`, // ✅ navigate to detail
                params: { level, lang },
              })
            }
          >
            <Text style={styles.title}>{item.title[lang]}</Text>

            <Text style={styles.body}>
              {level === "Beginner"
                ? "👶🏾 " +
                  (lang === "en"
                    ? "Imagine explaining this to a 10-year-old: "
                    : "Explique-le comme à un enfant de 10 ans : ") +
                  item.body[lang]
                : item.body[lang]}
            </Text>

            <View style={styles.quizBox}>
              <Text style={styles.quizQ}>{item.quiz.question[lang]}</Text>
              <Text style={styles.quizA}>👉 {item.quiz.answer}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },

  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  levelButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 8,
    borderRadius: 8,
  },
  levelButtonActive: {
    backgroundColor: "#007AFF",
  },
  levelText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  levelTextActive: {
    color: "white",
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  body: { fontSize: 15, color: "#333" },
  quizBox: { marginTop: 10, backgroundColor: "#fff", padding: 10, borderRadius: 10 },
  quizQ: { fontWeight: "600" },
  quizA: { color: "#007AFF", marginTop: 5 },
});