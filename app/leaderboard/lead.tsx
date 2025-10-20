// app/leaderboard/lead.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// --- Types ---
interface LeaderboardEntry {
    id: string;
    name: string;
    coins: number;
    percentile?: string;
    rank?: number;
}

// --- Sample Data (Global remains constant) ---
const globalLeaderboard: LeaderboardEntry[] = [
    { id: "1", name: "Cerydra", coins: 59000 },
    { id: "2", name: "Hysilens", coins: 40000 },
    { id: "3", name: "Phainon", coins: 34576 },
    { id: "4", name: "Hyacine", coins: 30000 },
    { id: "5", name: "Aglaea", coins: 27569 },
    { id: "6", name: "Anaxa", coins: 27568 },
    { id: "7", name: "Mydeimos", coins: 26000 },
    { id: "8", name: "Cifera", coins: 22000 },
    { id: "9", name: "Cyrene", coins: 19888 },
];

// Base Local Data (Misa will be replaced dynamically)
const baseLocalLeaderboard: LeaderboardEntry[] = [
    { id: "1", name: "Zandar", coins: 5600 },
    { id: "2", name: "Polka", coins: 5400 },
    { id: "3", name: "Nous", coins: 5200 },
    { id: "4", name: "Bronya", coins: 5000 },
    { id: "5", name: "Daruma", coins: 4500 },
    { id: "6", name: "Dolisu", coins: 4000 },
    { id: "7", name: "Shinami", coins: 3000 },
    { id: "8", name: "Silk", coins: 2000 },
    { id: "9", name: "Misa", coins: 1500 }, // This is the placeholder entry
];

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
    // 💡 FIX: Highlight if the item's name matches the current user's name
    // (This works for the local list where the user is at position 9)
    const isCurrentUser = item.name === currentUserName; 
    
    return (
        <View style={[styles.row, isCurrentUser && styles.highlightRow]}>
            <Text style={styles.rank} numberOfLines={1}>
                {index + 1}
            </Text>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {item.name}
            </Text>
            <Text style={styles.coins} numberOfLines={1}>
                {item.coins.toLocaleString()}
            </Text>
        </View>
    );
};

const CurrentUserRow = ({ user }: { user: LeaderboardEntry }) => (
    <View style={[styles.currentUserRow, styles.highlightRow]}>
        <Text style={styles.rank} numberOfLines={1}>
            {user.percentile}
        </Text>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {user.name}
        </Text>
        <Text style={styles.coins} numberOfLines={1}>
            {user.coins.toLocaleString()}
        </Text>
    </View>
);

// --- Screen Component ---
export default function LeaderboardScreen() {
    const [aboutVisible, setAboutVisible] = useState(false);
    const [tab, setTab] = useState<"global" | "local">("global");
    const [currentUserName, setCurrentUserName] = useState("Guest"); 

    const [fontsLoaded] = useFonts({
        Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
    });

    useFocusEffect(
        React.useCallback(() => {
            const loadUserName = async () => {
                try {
                    const storedName = await AsyncStorage.getItem("currentUserName");
                    if (storedName) {
                        setCurrentUserName(storedName);
                    }
                } catch (err) {
                    console.warn("Failed to load username:", err);
                }
            };
            loadUserName();
        }, [])
    );

    if (!fontsLoaded) return <Text>Loading...</Text>;

    // 💡 NEW LOGIC: Generate the current date string
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = today.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = today.getFullYear();
    const currentDateString = `${day} ${month} ${year}`;
    
    // Create the dynamic local leaderboard inside the component
    const localLeaderboard = baseLocalLeaderboard.map(entry => 
        entry.id === "9" && entry.name === "Misa" 
            ? { ...entry, name: currentUserName } // Replace Misa with currentUserName
            : entry
    );

    const leaderboardData = tab === "global" ? globalLeaderboard : localLeaderboard;

    const currentUser: LeaderboardEntry = {
        id: "me",
        name: currentUserName, 
        coins: 1500,
        percentile: "1.0%",
        rank: 1234,
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 💡 UPDATED: Display the dynamic date string */}
            <Text style={styles.date}>{currentDateString}</Text>

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

            <TouchableOpacity
                style={styles.boardBox}
                activeOpacity={0.9}
                onPress={() => setTab(tab === "global" ? "local" : "global")}
            >
                <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.rank, styles.headerCol]}>Pos.</Text>
                    <Text style={[styles.name, styles.headerCol]}>Name</Text>
                    <Text style={[styles.coins, styles.headerCol]}>Coins Obtained</Text>
                </View>

                <FlatList
                    data={leaderboardData}
                    renderItem={({ item, index }) => (
                        <LeaderboardItem 
                            item={item} 
                            index={index} 
                            currentUserName={currentUserName}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={tab === "global" ? <CurrentUserRow user={currentUser} /> : null}
                />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
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
        </SafeAreaView>
    );
}

// --- Styles (Unchanged) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#e6dcf6", padding: 12 },
    date: { textAlign: "left", fontSize: 20, fontFamily: "Jersey20", marginBottom: 12, color: "#222" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    headerText: { fontSize: 40, fontFamily: "Jersey20", color: "#222", textAlign: "center", flex: 1 },
    infoBtn: { fontWeight: "700", fontSize: 14, backgroundColor: "#e6dcf6", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 8, fontFamily: "Jersey20" },
    tierRow: { flexDirection: "row", alignItems: "center", justifyContent:"center", marginBottom: 8, columnGap: 6 },
    tierLabel: { fontFamily: "Jersey20", fontSize: 20 },
    tierBox: { backgroundColor: "#c8f5d1ff", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    tierText: { fontFamily: "Jersey20", color: "#000000ff" },
    boardBox: { flex: 1, backgroundColor: "#d9c6f2", borderRadius: 15, padding: 8 },
    row: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6dcf6", paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginVertical: 4, columnGap: 20 },
    headerRow: { backgroundColor: "#bda6e6", marginBottom: 6 },
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
});