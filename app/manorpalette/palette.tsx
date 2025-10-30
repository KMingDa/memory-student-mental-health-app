import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import PixelDialog from '../memory-modal/popout';

const { width } = Dimensions.get("window");

// --- ASSET IMPORTS ---
// Re-mapping assets based on the structure of the DailyNews file for consistency
const AVATAR = require("../../assets/images/misahead.png");
const HOME_ICON = require('../../assets/images/home.png'); // Adjusted to relative path
const BEAR_ICON = require('../../assets/images/bear.png');
const TROPHY_ICON = require('../../assets/images/trophy.png');
const SETTINGS_ICON = require('../../assets/images/settings.png');

// --- DATE FORMATTING FUNCTION ---
const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).replace(/ /g, ' ');
};
const formattedDate = getFormattedDate();

// --- COMPONENT ---
export default function App() {
    const router = useRouter();
    const [showDialog, setShowDialog] = useState(false);

    // Load the custom font
    const [fontsLoaded] = useFonts({
        Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
        // Adding Jersey15 font which is used in the standardized header
        Jersey15: require("@/assets/fonts/Jersey15-Regular.ttf"),
    });

    if (!fontsLoaded) return null; // Wait until font is loaded

    return (
        <SafeAreaView style={styles.container}>
            {/* --- NEW STANDARDIZED HEADER --- */}
            <View style={styles.header}>
                <Text style={styles.dateText}>{formattedDate}</Text>
                <View style={styles.profileIcon}>
                    <Image
                        source={AVATAR}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Title */}
                <Text style={styles.title}>MANOR PALETTE</Text>
                <Text style={styles.subtitle}>Select your game and have fun!</Text>

                {/* --- Book-ify! Card --- */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push("/bookify/bookify")}
                >
                    <Image
                        source={require("../../assets/images/bookifys.jpg")}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>Book-ify!</Text>
                        <Text style={styles.cardDesc}>
                            A simple, aesthetically pleasing bookshelf arranging minigame
                            where you can decorate as you please. No one is here to tell you
                            what’s right and what’s wrong.
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* --- Whack-a-Mole Card --- */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push("/whackgame/app")}
                >
                    <Image
                        source={require("../../assets/images/whackamole.jpg")}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>WHACK A MOLE</Text>
                        <Text style={styles.cardDesc}>
                            Stressed? This is a simple, fun minigame where you can de-stress
                            in the most classic way ever. Beware not to let the target leave
                            or else it’s game over!
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* 🔄 NEW STANDARDIZED BOTTOM NAVIGATION BAR */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('../furni-home/homesc')}
                >
                    <Image source={HOME_ICON} style={styles.navImage} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => setShowDialog(true)}
                >
                    <Image source={BEAR_ICON} style={styles.navImage} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('../../leaderboard/lead')}
                >
                    <Image source={TROPHY_ICON} style={styles.navImage} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Image source={SETTINGS_ICON} style={styles.navImage} />
                </TouchableOpacity>
            </View>

            <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFE6FE",
    },

    // --- NEW STANDARDIZED HEADER STYLES ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF5F5',
        marginTop: 5,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Jersey15',
    },
    profileIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFE4EC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    // -------------------------------------

    scroll: {
        alignItems: "center",
        paddingBottom: 150, // Increased padding to clear the bottom navigation bar
        paddingTop: 30,
    },
    title: {
        fontSize: 50,
        fontFamily: "Jersey20",
        color: "#C02020",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    card: {
        width: "90%",
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginBottom: 25,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 120,
    },
    textContainer: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 30,
        fontFamily: "Jersey20",
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: "justify",
    },

    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        marginBottom: 0,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        zIndex: 50, // Ensures visibility
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navImage: {
        width: 48,
        height: 48,
        resizeMode: 'contain',
    },
    // --- DIALOG STYLES (Placeholder for PixelDialog) ---
    dialogOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 60 },
    dialogContent: { padding: 20, backgroundColor: 'white', borderRadius: 10, width: '80%', alignItems: 'center' },
    dialogText: { fontSize: 18, marginBottom: 20 },
    dialogButton: { marginTop: 10, padding: 10, backgroundColor: '#BEEAF0', borderRadius: 5 },
    dialogButtonText: { color: '#2E6F79' },
});