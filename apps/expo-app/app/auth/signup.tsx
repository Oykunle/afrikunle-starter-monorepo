import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../../src/firebaseConfig";
import { useRouter, Link } from "expo-router";

export default function Signup() {
  console.log("🔥 Signup screen loaded");

  const auth = getAuth(app);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    console.log("🧩 Creating account for:", email);
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Account created:", userCredential.user.email);
      Alert.alert("Success!", "Your Afrikunle account has been created.");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      Alert.alert("Signup Failed", error.message || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Afrikunle Account</Text>

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

      <Button title="SIGN UP" onPress={() => {
        console.log("🖱️ Sign up button clicked");
        handleSignup();
      }} />

      <Text style={styles.text}>
        Already have an account?{" "}
        <Link href="/auth/login" style={{ color: "blue" }}>
          Log in
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