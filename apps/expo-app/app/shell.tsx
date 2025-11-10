import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../src/config";

export default function PythonShell() {
  const [code, setCode] = useState("print('Hello Afrikunle!')");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const runCode = async () => {
    setOutput("");
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.output || "");
      setError(data.error || "");
    } catch {
      setError("⚠️ Connection error. Make sure the API is running and API_URL is correct.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>🐍 Python Shell</Text>

      <TextInput
        multiline
        value={code}
        onChangeText={setCode}
        style={{
          borderWidth: 1, borderColor: "#ccc", padding: 10,
          borderRadius: 10, minHeight: 150, fontFamily: "monospace",
        }}
      />

      <View style={{ marginVertical: 12 }}>
        <Button title="▶️ Run Code" onPress={runCode} />
      </View>

      <ScrollView style={{ flex: 1, borderTopWidth: 1, borderColor: "#eee", paddingTop: 10 }}>
        {output ? <Text style={{ color: "green", fontFamily: "monospace" }}>{output}</Text> : null}
        {error ? <Text style={{ color: "red", fontFamily: "monospace" }}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}