import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useFonts } from "expo-font";
import { useFocusEffect, useRouter } from "expo-router"; // Import useFocusEffect
import React, { useState } from "react"; // Import React and useState
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const assets = {
    background: require("../../assets/profileimages/profilebg.png"),
    crown: require("../../assets/images/crown.png"),
    notebook: require("../../assets/images/diary.png"),
    chat: require("../../assets/images/chat.png"),
    avatar: require("../../assets/images/misavatar.png"),
    misahead: require("../../assets/images/misahead.png"),
    currency1: require("../../assets/images/currency1.png"),
    currency2: require("../../assets/images/currency2.png"),
    edit: require("../../assets/images/edit.png"),
    leaderboard: require("../../assets/images/leaderboard.png"),
    selfcare: require("../../assets/images/selfcare.png"),
    palette: require("../../assets/images/palette.png"),
    moodjournal: require("../../assets/images/moodjournal.png"),
    dailynews: require("../../assets/images/dailynews.png"),
    extra: require("../../assets/images/currency1.png"),
    checkin: require("../../assets/images/checkin.png"),
    quest: require("../../assets/images/questicon.png"),
    home: require("../../assets/images/home.png"),
    bear: require("../../assets/images/bear.png"),
    trophy: require("../../assets/images/trophy.png"),
    settings: require("../../assets/images/settings.png"),
};

export default function ProfileMain() {
    const router = useRouter();
    // 1. State for the username
    const [userName, setUserName] = useState("Misa"); 

    const [fontsLoaded] = useFonts({
        jersey15: require("../../assets/fonts/Jersey15-Regular.ttf"),
    });

    // 2. Data loading logic on screen focus
    useFocusEffect(
        React.useCallback(() => {
            const loadUserName = async () => {
                try {
                    // Load the username from AsyncStorage
                    const storedName = await AsyncStorage.getItem("currentUserName");
                    if (storedName) {
                        setUserName(storedName);
                    } else {
                        // Optional: Set a default name if nothing is found
                        setUserName("Guest");
                    }
                } catch (err) {
                    console.warn("Failed to load username:", err);
                    setUserName("Guest");
                }
            };
            loadUserName();
        }, [])
    );

    if (!fontsLoaded) return null;

    return (
        <ImageBackground source={assets.background} style={styles.bg} resizeMode="cover">
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* HEADER CARD */}
                    <View style={styles.card}>
                        <View style={styles.headerRow}>
                            <Image source={assets.misahead} style={styles.avatar} />
                            <View style={{ flex: 1 }}>
                                <View style={styles.nameRow}>
                                    {/* 3. Use the state variable for the name */}
                                    <Text style={styles.name}>{userName}</Text> 
                                    <Image source={assets.edit} style={styles.editIcon} />
                                </View>
                                <Text style={styles.role}>Newbie Tester</Text>
                            </View>
                        </View>

                        {/* XP BAR */}
                        <View style={styles.xpBarContainer}>
                            <View style={[styles.xpBarFill, { width: "30%" }]} />
                        </View>
                        <Text style={styles.xpText}>30 / 100</Text>

                        {/* Currency + Tier */}
                        <View style={styles.statsRow}>
                            <View style={styles.currencyRow}>
                                <Image source={assets.currency1} style={styles.currencyIcon} />
                                <Text style={styles.statText}>200</Text>
                            </View>
                            <View style={styles.currencyRow}>
                                <Image source={assets.currency2} style={styles.currencyIcon} />
                                <Text style={styles.statText}>1500</Text>
                            </View>
                        </View>
                        <Text style={styles.tierText}>
                            Current Tier: <Text style={styles.italic}>Archimedes</Text>
                        </Text>
                    </View>

                    {/* BADGE COLLECTION */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>
                            BADGE COLLECTION <Text style={styles.sectionCount}>20 / ?</Text>
                        </Text>
                        <View style={styles.iconRow}>
                            <Image source={assets.crown} style={styles.badgeIcon} />
                            <Image source={assets.notebook} style={styles.badgeIcon} />
                            <Image source={assets.chat} style={styles.badgeIcon} />
                        </View>
                    </View>

                    {/* CARD COLLECTION */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>
                            CARD COLLECTION <Text style={styles.sectionCount}>05 / ?</Text>
                        </Text>
                        <View style={styles.iconRow}>
                            <Image source={assets.avatar} style={styles.cardIcon} />
                            <Image source={assets.misahead} style={styles.cardIcon} />
                            <View style={styles.emptyCard} />
                            <View style={styles.emptyCard} />
                        </View>
                    </View>

                    {/* TITLE COLLECTION */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>
                            TITLE COLLECTION <Text style={styles.sectionCount}>10 / ?</Text>
                        </Text>
                        <View style={styles.titleRow}>
                            <Text style={[styles.titleBadge, { backgroundColor: "#ffd6d6" }]}>
                                Newbie Tester
                            </Text>
                            <Text style={[styles.titleBadge, { backgroundColor: "#d6ecff" }]}>
                                Dear Memory
                            </Text>
                            <Text style={[styles.titleBadge, { backgroundColor: "#fff6d6" }]}>
                                Archi-mighty!
                            </Text>
                            <Text style={[styles.titleBadge, { backgroundColor: "#d6ffe7" }]}>
                                Healing Time!
                            </Text>
                            <Text style={[styles.titleBadge, { backgroundColor: "#e6d6ff" }]}>
                                Welcome!
                            </Text>
                            <Text style={[styles.titleBadge, { backgroundColor: "#ffd6ec" }]}>
                                Whack-A-Stress
                            </Text>
                            <Text style={[styles.titleBadge, { backgroundColor: "#ffe6cc" }]}>
                                Dream Walker
                            </Text>
                            <Text style={[styles.titleBadge, { backgroundColor: "#ccffe6" }]}>
                                Mindful Soul
                            </Text>
                            <Text style={[styles.titleBadge, { backgroundColor: "#e6ccff" }]}>
                                Star Seeker
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* BOTTOM NAV */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity onPress={() => router.push("/furni-home/homesc")}>
                        <Image source={assets.home} style={styles.navIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/memory-modal/popout")}>
                        <Image source={assets.bear} style={styles.navIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/leaderboard/lead")}>
                        <Image source={assets.trophy} style={styles.navIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push("/login")}>
                        <Image source={assets.settings} style={styles.navIcon} />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </ImageBackground>
    );
}

/* ---------- Set this to a bigger value to scale everything up ---------- */
const SCALE = 1.3;

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16 * SCALE,
        paddingBottom: 100 * SCALE,
        alignItems: "center",
    },

    card: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 12 * SCALE,
        padding: 12 * SCALE,
        marginBottom: 16 * SCALE,
        width: "95%",
        alignSelf: "center",
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8 * SCALE,
    },

    avatar: {
        width: 60 * SCALE,
        height: 60 * SCALE,
        borderRadius: 8 * SCALE,
        marginRight: 12 * SCALE,
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    name: {
        fontFamily: "jersey15",
        fontSize: 20 * SCALE,
        color: "#000",
        marginRight: 6 * SCALE,
    },

    editIcon: {
        width: 14 * SCALE,
        height: 14 * SCALE,
    },

    role: {
        fontFamily: "jersey15",
        fontSize: 14 * SCALE,
        color: "#333",
        marginTop: 2 * SCALE,
    },

    xpBarContainer: {
        backgroundColor: "#ddd",
        height: 10 * SCALE,
        borderRadius: 5 * SCALE,
        marginTop: 8 * SCALE,
        overflow: "hidden",
    },

    xpBarFill: {
        backgroundColor: "#a8e063",
        height: "100%",
    },

    xpText: {
        fontFamily: "jersey15",
        fontSize: 12 * SCALE,
        color: "#333",
        textAlign: "right",
        marginTop: 2 * SCALE,
    },

    statsRow: {
        flexDirection: "row",
        marginTop: 8 * SCALE,
        marginBottom: 4 * SCALE,
    },

    currencyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16 * SCALE,
    },

    currencyIcon: {
        width: 20 * SCALE,
        height: 20 * SCALE,
        marginRight: 6 * SCALE,
    },

    statText: {
        fontFamily: "jersey15",
        fontSize: 14 * SCALE,
        color: "#000",
    },

    tierText: {
        fontFamily: "jersey15",
        fontSize: 14 * SCALE,
        marginTop: 4 * SCALE,
    },

    italic: {
        fontStyle: "italic",
    },

    sectionTitle: {
        fontFamily: "jersey15",
        fontSize: 16 * SCALE,
        marginBottom: 8 * SCALE,
        color: "#000",
    },

    sectionCount: {
        fontSize: 14 * SCALE,
        color: "#333",
    },

    iconRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },

    badgeIcon: {
        width: 40 * SCALE,
        height: 40 * SCALE,
        marginRight: 12 * SCALE,
    },

    cardIcon: {
        width: 60 * SCALE,
        height: 60 * SCALE,
        borderRadius: 8 * SCALE,
        marginRight: 8 * SCALE,
    },

    emptyCard: {
        width: 60 * SCALE,
        height: 60 * SCALE,
        borderRadius: 8 * SCALE,
        backgroundColor: "#eee",
        marginRight: 8 * SCALE,
    },

    titleRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between", // spread evenly
    },
    titleBadge: {
        fontFamily: "jersey15",
        fontSize: 14 * SCALE,
        paddingVertical: 8 * SCALE,
        paddingHorizontal: 12 * SCALE,
        borderRadius: 8,
        marginBottom: 12,
        textAlign: "center",
        color: "#000",
        borderColor: "#fff",
        borderWidth: 2,
        flexBasis: "30%", // ✅ roughly 3 per row
    },

    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingVertical: 10 * SCALE,
        height: 70 * SCALE,
    },

    navIcon: {
        width: 28 * SCALE,
        height: 28 * SCALE,
    },
});