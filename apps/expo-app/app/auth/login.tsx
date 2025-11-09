import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../src/firebaseConfig";
import { useRouter, Link } from "expo-router";

export default function Login() {
  const auth = getAuth(app);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("🔑 Attempting login:", email);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login success:", userCredential.user.email);
      Alert.alert("Welcome back!", "You are now logged in.");
      router.push("/lessons"); // Redirect to the lessons screen
    } catch (error: any) {
      console.error("❌ Login error:", error.message);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back to Afrikunle</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="LOG IN" onPress={handleLogin} />
      <Text style={styles.text}>
        Don’t have an account?{" "}
        <Link href="/auth/signup" style={{ color: "blue" }}>
          Sign up
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  text: { textAlign: "center", marginTop: 15 },
});