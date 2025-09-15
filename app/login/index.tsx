import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";

const loginBg = require('../../assets/images/login.png')
const continueEmailImg = require('../../assets/images/continuewemail.png')  // overlay image

type RootStackParamList = {
    Login: undefined;
    CottonCandy: undefined;
};

export default function LoginScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const router = useRouter();

    const handleContinue = () => {
        router.push('/login/cottoncandy') // or '/cottoncandy' if file is at app/cottoncandy.tsx
    }

    return (
        <View style={styles.root}>
            <ImageBackground
                source={loginBg}
                style={styles.bg}
                resizeMode="contain"
            >
                <TouchableOpacity style={styles.emailButton} onPress={handleContinue} activeOpacity={0.85}>
                    <Image
                        source={continueEmailImg}
                        style={styles.emailButtonImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    bg: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "flex-end", // button sits at bottom
        alignItems: "center",
    },
    emailButton: {
        position: 'absolute',
        bottom: 140,
        width: 285,
        height: 185,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emailButtonImage: {
        width: '100%',
        height: '100%',
    },
});
