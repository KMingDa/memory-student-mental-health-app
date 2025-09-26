import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import users from "../../assets/data/users.json";
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

    const handleLogin = () => {
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
            setError("");
            router.push("/furni-home/homesc");
        } else {
            setError("Invalid email or password");
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
                    <Text style={{ color: "red", fontFamily: "retro", marginBottom: 10 }}>
                        {error}
                    </Text>
                ) : null}

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={[styles.buttonText, { fontFamily: "retro" }]}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
    },
    backArrow: {
        fontSize: 20,
        color: "white",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        margin: 20,
        padding: 20,
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        backgroundColor: "rgba(255,255,255,0.8)", // semi-white box
        borderWidth: 2,
        borderColor: "white",
        padding: 12,
        marginBottom: 15,
        borderRadius: 6,
        color: "black", // dark text inside
        fontSize: 10,
    },

    button: {
        backgroundColor: "#6a5acd",
        padding: 14,
        borderRadius: 6,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 12,
    },
});
