import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import usersJson from "../../assets/data/users.json";
import RetroWelcome from "../../components/RetroWelcome";

const bgImage = require("../../assets/images/mainbg.jpg");

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    retro: require("../../assets/fonts/PressStart2P-Regular.ttf"),
  });

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    try {
      // Load saved users (custom ones) and merge with bundled ones
      const localUsersRaw = await AsyncStorage.getItem("users");
      const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : [];
      const allUsers = [...usersJson, ...localUsers];

      // Find matching user
      const user = allUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        setError("");

        // ✅ Save the logged-in user's name for future use
        await AsyncStorage.setItem("currentUserName", user.name);

        // Optionally, save email as well if needed elsewhere
        await AsyncStorage.setItem("currentUserEmail", user.email);

        // Navigate to home
        router.push("/furni-home/homesc");
      } else {
        setError("Invalid email or password");
      }
    } catch (e) {
      console.error(e);
      setError("Error reading users");
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backArrow, { fontFamily: "retro" }]}>{`<`}</Text>
      </TouchableOpacity>

      <View style={styles.overlay}>
        <RetroWelcome />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#000000"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={[styles.input, { fontFamily: "retro" }]}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#000000"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          style={[styles.input, { fontFamily: "retro" }]}
        />

        {error ? (
          <Text
            style={{
              color: "red",
              fontFamily: "retro",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={[styles.buttonText, { fontFamily: "retro" }]}>
            LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  backArrow: { fontSize: 20, color: "white" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 2,
    borderColor: "white",
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    color: "black",
    fontSize: 10,
  },
  button: {
    backgroundColor: "#6a5acd",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 12 },
});