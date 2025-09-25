import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RetroWelcome from "../../components/RetroWelcome";

const bgImage = require("../../assets/images/mainbg.jpg");

export default function LoginScreen() {
    const [fontsLoaded] = useFonts({
        retro: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    });

    const router = useRouter();

    if (!fontsLoaded) return null;

    return (
        <ImageBackground source={bgImage} style={styles.background}>
            {/* Back Arrow */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
                <Text style={[styles.backArrow, { fontFamily: "retro" }]}>{"<"}</Text>
            </TouchableOpacity>

            <View style={styles.overlay}>
                <RetroWelcome />

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    style={[styles.input, { fontFamily: "retro" }]}
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                    secureTextEntry
                    style={[styles.input, { fontFamily: "retro" }]}
                />

                <TouchableOpacity style={styles.button}>
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
