import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export default function RetroWelcome() {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 1000,   // quicker fade OUT
                    useNativeDriver: true,
                }),
                // Fade in slower
                Animated.timing(opacity, {
                    toValue: 1.7,
                    duration: 1450,   // slower fade IN
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <Animated.Text style={[styles.welcome, { opacity, fontFamily: "retro" }]}>
            WELCOME
        </Animated.Text>
    );
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 30,
        color: "white",
        textAlign: "center",
        marginBottom: 30,
    },
});
