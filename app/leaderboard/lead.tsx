import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCurrency } from "../context/CurrencyContext";

// --- GLOBAL ASSET PATHS (For new nav bar) ---
const HOME_ICON = require("../../assets/images/home.png"); 
const BEAR_ICON = require("../../assets/images/bear.png");
const TROPHY_ICON = require("../../assets/images/trophy.png");
const SETTINGS_ICON = require("../../assets/images/settings.png");
// ---

// --- Types ---
interface LeaderboardEntry {
    id: string;
    name: string;
    coins: number;
    percentile?: string;
    rank?: number;
}

// --- Sample Data ---
const globalLeaderboard: LeaderboardEntry[] = [
    { id: "1", name: "Cerydra", coins: 59000 },
    { id: "2", name: "Hysilens", coins: 40000 },
    { id: "3", name: "Phainon", coins: 34576 },
    { id: "4", name: "Hyacine", coins: 30000 },
    { id: "5", name: "Aglaea", coins: 27569 },
    { id: "6", name: "Anaxa", coins: 27568 },
    { id: "7", name: "Mydeimos", coins: 26000 },
    { id: "8", "name": "Cifera", coins: 22000 },
    { id: "9", "name": "Cyrene", coins: 19888 },
];

const baseLocalLeaderboard: LeaderboardEntry[] = [
    { id: "1", name: "Zandar", coins: 5600 },
    { id: "2", name: "Polka", coins: 5400 },
    { id: "3", name: "Nous", coins: 5200 },
    { id: "4", name: "Bronya", coins: 5000 },
    { id: "5", name: "Daruma", coins: 4500 },
    { id: "6", name: "Dolisu", coins: 4000 },
    { id: "7", name: "Shinami", coins: 3000 },
    { id: "8", name: "Silk", coins: 2000 },
    { id: "9", name: "Misa", coins: 1500 }, 
];

// --- Local Dialog Component (Placeholder for Bear Dialog) ---
const LocalPixelDialog = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    if (!visible) return null;
    return (
        <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Bear Dialog Placeholder</Text> 
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


// --- Components ---
const LeaderboardItem = ({
    item,
    index,
    currentUserName,
}: {
    item: LeaderboardEntry;
    index: number;
    currentUserName: string;
}) => {
    const isCurrentUser = item.name === currentUserName;
    return (
        <View style={[styles.row, isCurrentUser && styles.highlightRow]}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {item.name}
            </Text>
            <Text style={styles.coins}>{item.coins.toLocaleString()}</Text>
        </View>
    );
};

const CurrentUserRow = ({ user }: { user: LeaderboardEntry }) => (
    <View style={[styles.currentUserRow, styles.highlightRow]}>
        <Text style={styles.rank}>{user.percentile}</Text>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.coins}>{user.coins.toLocaleString()}</Text>
    </View>
);

// --- MAIN COMPONENT ---
export default function LeaderboardScreen() {
    const router = useRouter();
    const [aboutVisible, setAboutVisible] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [tab, setTab] = useState<"global" | "local">("global");
    const [currentUserName, setCurrentUserName] = useState("Guest");

    // 🏆 FIX: Destructure 'currency' (the correct property name) instead of 'currentCoins'
    const { currency } = useCurrency(); 

    const [fontsLoaded] = useFonts({
        Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
        Jersey15: require("@/assets/fonts/Jersey15-Regular.ttf"), 
    });

    useFocusEffect(
        React.useCallback(() => {
            const loadUserName = async () => {
                try {
                    const storedName = await AsyncStorage.getItem("currentUserName");
                    if (storedName) setCurrentUserName(storedName);
                } catch (err) {
                    console.warn("Failed to load username:", err);
                }
            };
            loadUserName();
        }, [])
    );

    if (!fontsLoaded) return <Text>Loading...</Text>;

    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = today.toLocaleString("default", { month: "short" }).toUpperCase();
    const year = today.getFullYear();
    const currentDateString = `${day} ${month} ${year}`;

    // Update localLeaderboard to use the fetched 'currency' value
    const localLeaderboard = baseLocalLeaderboard.map((entry) =>
        entry.id === "9" && entry.name === "Misa"
            ? { ...entry, name: currentUserName, coins: currency } // Use 'currency'
            : entry
    );

    const leaderboardData = tab === "global" ? globalLeaderboard : localLeaderboard;

    // Update currentUser to use the fetched 'currency' value
    const currentUser: LeaderboardEntry = {
        id: "me",
        name: currentUserName,
        coins: currency, // Use the fetched 'currency'
        percentile: "1.0%",
        rank: 1234,
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Standardized Header */}
            <View style={styles.headerBar}>
                <Text style={styles.dateText}>{currentDateString}</Text>
                <View style={styles.profileIcon}>
                    <Image
                        source={require("../../assets/images/misahead.png")}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                </View>
            </View>

            {/* Leaderboard Title/Toggle Area */}
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {tab === "global" ? "Global Leaderboard" : "Local Leaderboard"}
                </Text>
                <TouchableOpacity onPress={() => setAboutVisible(true)}>
                    <Text style={styles.infoBtn}>i</Text>
                </TouchableOpacity>
            </View>

            {tab === "local" && (
                <View style={styles.tierRow}>
                    <Text style={styles.tierLabel}>Tier :</Text>
                    <View style={styles.tierBox}>
                        <Text style={styles.tierText}>Archimedes</Text>
                    </View>
                </View>
            )}

            {/* Main Leaderboard Box - Now uses View instead of TouchableOpacity for scrolling */}
            <View style={styles.boardContainer}> 
                <TouchableOpacity
                    style={styles.boardHeaderButton} // New style for the header row/button
                    onPress={() => setTab(tab === "global" ? "local" : "global")}
                >
                    <View style={[styles.row, styles.headerRow, styles.boardHeaderRow]}>
                        <Text style={[styles.rank, styles.headerCol]}>Pos.</Text>
                        <Text style={[styles.name, styles.headerCol]}>Name</Text>
                        <Text style={[styles.coins, styles.headerCol]}>Coins Obtained</Text>
                    </View>
                </TouchableOpacity>

                <FlatList
                    style={styles.flatList} // Enables scrolling within the defined space
                    contentContainerStyle={styles.flatListContent}
                    data={leaderboardData}
                    renderItem={({ item, index }) => (
                        <LeaderboardItem
                            item={item}
                            index={index}
                            currentUserName={currentUserName}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    // ListFooterComponent is used for the current user in GLOBAL tab
                    ListFooterComponent={
                        tab === "global" ? <CurrentUserRow user={currentUser} /> : null
                    }
                />
            </View>

            {/* About Modal (Unchanged) */}
            <Modal
                animationType="fade"
                transparent
                visible={aboutVisible}
                onRequestClose={() => setAboutVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>About Leaderboard</Text>
                        <Text style={styles.modalText}>
                            This leaderboard is known as “Positivity Leaderboard”.
                            {"\n\n"}It is not meant to promote toxicity, but to cultivate
                            positivity in users whilst adding fun competition.
                            {"\n\n"}Earn coins by logging in and using features. Coins can be
                            used to buy furniture, unlock photocards, and more.
                            {"\n\n"}Reaching top 10 in tiers grants rewards and motivation
                            scores.
                        </Text>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setAboutVisible(false)}
                        >
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 🚀 STANDARDIZED BOTTOM NAVIGATION BAR */}
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
            <LocalPixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
        </SafeAreaView>
    );
}

// --- Styles (Unchanged) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#e6dcf6", padding: 0 },
    date: { textAlign: "left", fontSize: 20, fontFamily: "Jersey20", marginBottom: 12, color: "#222" },
    
    // 💡 NEW STANDARDIZED HEADER STYLES
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF5F5',
        width: '100%',
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
    // ------------------------------------

    // 📢 Leaderboard Title Area
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingHorizontal: 12, paddingTop: 10 },
    headerText: { fontSize: 28, fontFamily: "Jersey20", color: "#222", textAlign: "center", flex: 1 }, 
    infoBtn: { fontWeight: "700", fontSize: 14, backgroundColor: "#d9c6f2", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 8, fontFamily: "Jersey20" },
    tierRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 8, columnGap: 6 },
    tierLabel: { fontFamily: "Jersey20", fontSize: 20 },
    tierBox: { backgroundColor: "#c8f5d1ff", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    tierText: { fontFamily: "Jersey20", color: "#000000ff" },

    // 💡 SCROLLING FIX: New container for flex control
    boardContainer: {
        flex: 1, // Takes up remaining vertical space
        backgroundColor: "#d9c6f2", 
        borderRadius: 15, 
        padding: 8, 
        marginHorizontal: 12, // Added margin for spacing
        marginBottom: 78, // Space for the bottomNav (approx height of nav bar)
    },
    boardHeaderButton: {
        // Allows the header to be clickable without forcing the FlatList to be unscrollable
        marginBottom: 6,
    },
    flatList: {
        flex: 1, // Allows FlatList to scroll within boardContainer
        backgroundColor: '#d9c6f2',
    },
    flatListContent: {
        paddingBottom: 20, // Extra padding at the bottom of the list content
    },
    // Original styles kept for row visuals
    boardBox: { // <-- RETAINED but only for color/border/padding of the overall visual container
        // Original style moved to boardContainer for flex behavior
    },
    row: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6dcf6", paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginVertical: 4, columnGap: 20 },
    
    // Header Row Fix:
    headerRow: { backgroundColor: "#bda6e6", marginBottom: 6 },
    boardHeaderRow: { marginBottom: 0 }, // Removed margin from actual header row
    headerCol: { color: "#fff", fontWeight: "600" },

    highlightRow: { backgroundColor: "#FFE3E3" },
    currentUserRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f1e6ff", paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginTop: 10, borderWidth: 1.5, borderColor: "#9c7ed7", columnGap: 20 },
    rank: { fontFamily: "Jersey20", flex: 1, textAlign: "center", color: "#222" },
    name: { flex: 3, fontSize: 19, fontFamily: "Jersey20", color: "#222", textAlign: "center" },
    coins: { flex: 2, fontFamily: "Jersey20", textAlign: "right", color: "#222" },
    modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalBox: { width: "85%", backgroundColor: "#f5e8ff", padding: 20, borderRadius: 12 },
    modalTitle: { fontSize: 18, fontFamily: "Jersey20", marginBottom: 10, textAlign: "center" },
    modalText: { fontSize: 14, fontFamily: "Jersey20", marginBottom: 20, lineHeight: 20 },
    closeBtn: { backgroundColor: "#d9c6f2", padding: 10, borderRadius: 8, alignItems: "center" },
    closeText: { fontFamily: "Jersey20" },

    // 💡 STANDARDIZED BOTTOM NAVIGATION BAR STYLES
    bottomNav: { 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        paddingVertical: 15, 
        paddingHorizontal: 20, 
        justifyContent: 'space-around', 
        borderTopWidth: 1, 
        borderTopColor: '#E0E0E0', 
        marginBottom: 0, // Set to 0 to sit exactly at the bottom of the screen
        width: '100%', 
        position: 'absolute', 
        bottom: 0,
        zIndex: 50, 
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
});