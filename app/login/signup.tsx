import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import users from "../../assets/data/users.json";
import RetroWelcome from "../../components/RetroWelcome";

const bgImage = require("../../assets/images/mainbg.jpg");

export default function SignUpScreen() {
    const [fontsLoaded] = useFonts({
        retro: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    });

    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    if (!fontsLoaded) return null;

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const localUsersRaw = await AsyncStorage.getItem("users");
            const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : [];

            const allUsers = [...users, ...localUsers];

            const userExists = allUsers.find(u => u.email === email);
            if (userExists) {
                setError("User already exists");
                return;
            }

            const newUser = { name, email, password };

            const updatedUsers = [...localUsers, newUser];
            await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

            setError("");
            router.push("/login/loginpage");
        } catch (e) {
            console.error(e);
            setError("Failed to save user");
        }
    };

    return (
        <ImageBackground source={bgImage} style={styles.background}>
            {/* Back Arrow */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={[styles.backArrow, { fontFamily: "retro" }]}>{"<"}</Text>
            </TouchableOpacity>

            <View style={styles.overlay}>
                <RetroWelcome />

                <TextInput
                    placeholder="Username"
                    placeholderTextColor="#000000"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    style={[styles.input, { fontFamily: "retro" }]}
                />

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#000000"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[styles.input, { fontFamily: "retro" }]}
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#000000"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[styles.input, { fontFamily: "retro" }]}
                />

                <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#000000"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={[styles.input, { fontFamily: "retro" }]}
                />

                {error ? (
                    <Text style={{ color: "red", fontFamily: "retro", marginBottom: 10 }}>
                        {error}
                    </Text>
                ) : null}

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={[styles.buttonText, { fontFamily: "retro" }]}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: "cover" },
    backButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
    backArrow: { fontSize: 20, color: "white" },
    overlay: { flex: 1, justifyContent: "center", margin: 20, padding: 20, borderRadius: 8 },
    input: { backgroundColor: "rgba(255,255,255,0.8)", borderWidth: 2, borderColor: "white", padding: 12, marginBottom: 15, borderRadius: 6, color: "black", fontSize: 10 },
    button: { backgroundColor: "#6a5acd", padding: 14, borderRadius: 6, alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 12 },
});
