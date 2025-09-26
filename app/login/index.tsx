import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const loginBg = require('../../assets/images/login.png');
const logoImg = require('../../assets/images/logo.png');  
const continueEmailImg = require('../../assets/images/continuewemail.png');
const googleImg = require('../../assets/images/gmaillogin.png'); 
const facebookImg = require('../../assets/images/fblogin.png');

type RootStackParamList = {
    Login: undefined;
    CottonCandy: undefined;
};

export default function LoginScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const router = useRouter();
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        Font.loadAsync({
            Jersey20: require('../../assets/fonts/Jersey20-Regular.ttf'),
        }).then(() => setFontsLoaded(true));
    }, []);

    const handleContinue = () => {
        router.push('/login/loginpage');
    };

    const handleSignUp = () => {
        router.push('/login/signup');
    };

    if (!fontsLoaded) return null;

    return (
        <View style={styles.root}>
            <ImageBackground
                source={loginBg}
                style={styles.bg}
                resizeMode="cover"
            >
                {/* Logo */}
                <Image
                    source={logoImg}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Buttons container */}
                <View style={styles.buttonsContainer}>
                    {/* Email Button */}
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleContinue} 
                        activeOpacity={0.85}
                    >
                        <Image
                            source={continueEmailImg}
                            style={styles.buttonImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Google Button (disabled) */}
                    <TouchableOpacity style={[styles.button, styles.disabled]} disabled>
                        <Image
                            source={googleImg}
                            style={styles.buttonImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Facebook Button (disabled) */}
                    <TouchableOpacity style={[styles.button, styles.disabled]} disabled>
                        <Image
                            source={facebookImg}
                            style={styles.buttonImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Sign Up Text */}
                    <View style={styles.signupContainer}>
                        <Text style={[styles.signupText, { fontFamily: "Jersey20" }]}>
                            Don’t have an account?
                        </Text>
                        <Text
                            style={[styles.signupLink, { fontFamily: "Jersey20" }]}
                            onPress={handleSignUp} // 点击跳转
                        >
                            Sign Up
                        </Text>
                    </View>
                </View>
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
        justifyContent: "flex-end",
        alignItems: "center",
    },
    logo: {
        width: 400,
        height: 400,
        marginBottom: 10, 
    },
    buttonsContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 40,
    },
    button: {
        width: 320,
        height: 60,
        marginVertical: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonImage: {
        width: '100%',
        height: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    signupContainer: {
        marginTop: 30,
        alignItems: "center",
        width: "60%",
    },
    signupText: {
        fontSize: 22,
        color: "#FFF",
    },
    signupLink: {
        fontSize: 22,
        color: "#FFF",
        fontWeight: "bold",
    },
});
