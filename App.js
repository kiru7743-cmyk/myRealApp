import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  signOut,
} from "firebase/auth";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyARcJ845BiEh3Cc14nBAOpq2XKWKnTcezE",
  authDomain: "needthis-8069a.firebaseapp.com",
  projectId: "needthis-8069a",
  storageBucket: "needthis-8069a.appspot.com",
  messagingSenderId: "55294374096",
  appId: "1:55294374096:web:b52847c2254caeec5f2ed5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearFields = () => {
    setEmail("");
    setPassword("");
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      await sendEmailVerification(auth.currentUser);
      Alert.alert("Success", "Account created. Check your email for verification.", [
        { text: "OK", onPress: () => setMode("login") }
      ]);
      clearFields();
    } catch (err) {
      Alert.alert("Signup Error", err.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      clearFields();
      setMode("home");
    } catch (err) {
      Alert.alert("Login Error", err.message);
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        "Reset Email Sent",
        "Check your inbox to reset your password.",
        [
          {
            text: "OK",
            onPress: () => {
              clearFields();
              setMode("login");
            }
          }
        ]
      );
    } catch (err) {
      Alert.alert("Reset Error", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (!auth.currentUser) return Alert.alert("Error", "You must be logged in first");
      await deleteUser(auth.currentUser);
      Alert.alert("Account Deleted", "Your account has been removed.", [
        { text: "OK", onPress: () => setMode("login") }
      ]);
    } catch (err) {
      Alert.alert("Delete Error", err.message);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.appTitle}>Firebase Auth Demo</Text>

        {mode === "login" && (
          <>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Login" onPress={handleLogin} />
            <View style={{ height: 8 }} />
            <Button title="Create Account" onPress={() => setMode("signup")} />
            <Button title="Forgot Password" onPress={() => setMode("reset")} />
          </>
        )}

        {mode === "signup" && (
          <>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Sign Up" onPress={handleSignup} />
          </>
        )}

        {mode === "reset" && (
          <>
            <Text style={styles.title}>Reset Password</Text>
            <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <Button title="Send Reset Email" onPress={handleReset} />
          </>
        )}

        {mode === "home" && (
          <>
            <Text style={styles.title}>Welcome 🎉</Text>
            <Button title="Logout" onPress={() => { signOut(auth); setMode("login"); }} />
            <Button title="Delete Account" color="red" onPress={handleDelete} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#111" },
  container: { flexGrow: 1, padding: 24, justifyContent: "center" },
  appTitle: { fontSize: 28, fontWeight: "bold", color: "white", textAlign: "center", marginBottom: 24 },
  title: { fontSize: 20, color: "white", marginBottom: 16, fontWeight: "bold", textAlign: "center" },
  input: { backgroundColor: "white", padding: 10, marginBottom: 10, borderRadius: 6 },
});
