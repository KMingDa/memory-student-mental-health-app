import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrency } from "../context/CurrencyContext";

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

// --- DATA FOR TITLE SELECTION MODAL ---
const AVAILABLE_TITLES = [
    { title: "Newbie Tester", color: "#ffd6d6" },
    { title: "Dear Memory", color: "#d6ecff" },
    { title: "Archi-mighty!", color: "#fff6d6" },
    { title: "Healing Time!", color: "#d6ffe7" },
    { title: "Welcome!", color: "#e6d6ff" },
    { title: "Whack-A-Stress", color: "#ffd6ec" },
    { title: "Dream Walker", color: "#ffe6cc" },
    { title: "Mindful Soul", color: "#ccffe6" },
    { title: "Star Seeker", color: "#e6ccff" },
];

// --- ACHIEVEMENT TIER (Read-Only Default) ---
const ACHIEVEMENT_TITLE = "Archimedes";


export default function ProfileMain() {
    const router = useRouter();
    
    // States for Name (Editable)
    const [userName, setUserName] = useState("Misa"); 
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempUserName, setTempUserName] = useState("Misa");

    // States for Role/Status (Editable via Modal)
    const [currentRole, setCurrentRole] = useState("Newbie Tester");
    
    // States for Achievement Title (Read-Only Tier)
    const [currentTitle, setCurrentTitle] = useState(ACHIEVEMENT_TITLE);
    const [showTitleModal, setShowTitleModal] = useState(false);
    
    // Dialog State
    const [showDialog, setShowDialog] = useState(false); 

    const { currency } = useCurrency();

    const [fontsLoaded] = useFonts({
        jersey15: require("../../assets/fonts/Jersey15-Regular.ttf"),
    });

    // ******************************************************
    // 💾 ASYNC STORAGE LOAD LOGIC
    // ******************************************************
    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                try {
                    // 1. LOAD NAME
                    const storedName = await AsyncStorage.getItem("currentUserName");
                    if (storedName) {
                        setUserName(storedName);
                        setTempUserName(storedName);
                    } else {
                        setUserName("Misa");
                        setTempUserName("Misa");
                    }

                    // 2. LOAD ROLE/STATUS (The editable field)
                    const storedRole = await AsyncStorage.getItem("currentRole");
                    if (storedRole) {
                        setCurrentRole(storedRole);
                    } else {
                        setCurrentRole("Newbie Tester"); 
                    }
                    
                    // 3. LOAD ACHIEVEMENT TIER (Read-Only)
                    let storedTitle = await AsyncStorage.getItem("currentTitle"); 
                    
                    // Defense mechanism: If title is null or accidentally set to an editable role, reset it.
                    if (!storedTitle || AVAILABLE_TITLES.some(t => t.title === storedTitle)) {
                        storedTitle = ACHIEVEMENT_TITLE;
                        await AsyncStorage.setItem("currentTitle", ACHIEVEMENT_TITLE);
                    }
                    setCurrentTitle(storedTitle);

                } catch (err) {
                    console.warn("Failed to load user data:", err);
                }
            };
            loadUserData();
        }, [])
    );
    // ******************************************************

    // 💾 FUNCTION: Save Name (Now triggers on button press or submit)
    const handleSaveName = async () => {
        if (tempUserName.trim()) {
            setUserName(tempUserName.trim());
            await AsyncStorage.setItem("currentUserName", tempUserName.trim()); // ✅ SAVING NAME
        } else {
            // Revert tempUserName to actual userName if input was empty
            setTempUserName(userName);
        }
        setIsEditingName(false);
    };

    // 💾 FUNCTION: Select Role (Updates the editable status field)
    const handleRoleSelect = async (role: string) => {
        setCurrentRole(role);
        await AsyncStorage.setItem("currentRole", role); // ✅ SAVING ROLE/STATUS
        setShowTitleModal(false);
    };

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
                                    {/* Name Display / Edit Input */}
                                    {isEditingName ? (
                                        <TextInput
                                            style={[styles.nameInput, styles.name, {fontFamily: 'jersey15'}]} 
                                            value={tempUserName}
                                            onChangeText={setTempUserName}
                                            onSubmitEditing={handleSaveName} // Saves on keyboard 'Done'
                                            autoFocus
                                            placeholder="Enter Name"
                                        />
                                    ) : (
                                        <Text style={styles.name}>{userName}</Text> 
                                    )}
                                    {/* Edit Name Button */}
                                    <TouchableOpacity onPress={() => {
                                        if (isEditingName) {
                                            // 💡 ACTION: Explicitly call save when pressing the button to exit edit mode
                                            handleSaveName(); 
                                        } else {
                                            setIsEditingName(true);
                                        }
                                    }}>
                                        <Image source={assets.edit} style={styles.editIcon} />
                                    </TouchableOpacity>
                                </View>
                                
                                {/* 📢 ROLE DISPLAY / EDIT INPUT: Clicking opens the Title Selection Modal */}
                                <TouchableOpacity 
                                    onPress={() => setShowTitleModal(true)} 
                                    style={styles.roleContainer}
                                >
                                    {/* The Role/Status is displayed here, and is the value changed by the modal */}
                                    <Text style={[styles.role, styles.editableRole]}>{currentRole}</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                        {/* XP BAR */}
                        <View style={styles.xpBarContainer}>
                            <View style={[styles.xpBarFill, { width: "30%" }]} />
                        </View>
                        <Text style={styles.xpText}>30 / 100</Text>

                        {/* Currency + Title */}
                        <View style={styles.statsRow}>
                            {/* NOTE: Currency 1 is left hardcoded as 200 */}
                            <View style={styles.currencyRow}>
                                <Image source={assets.currency1} style={styles.currencyIcon} />
                                <Text style={styles.statText}>200</Text> 
                            </View>
                            {/* 3. 💸 Currency 2 now uses the dynamic 'currency' value */}
                            <View style={styles.currencyRow}>
                                <Image source={assets.currency2} style={styles.currencyIcon} />
                                <Text style={styles.statText}>{currency.toLocaleString()}</Text>
                            </View>
                        </View>
                        {/* CURRENT TIER DISPLAY (Read-only achievement tier) */}
                        <View style={styles.tierContainer}> 
                            <Text style={styles.tierText}>
                                Current Tier: <Text style={styles.italic}>{currentTitle}</Text>
                            </Text>
                        </View>
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

                    {/* CARD COLLECTION - FIXED LAYOUT */}
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

                    {/* TITLE COLLECTION (List displays available titles, highlights current role) */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>
                            TITLE COLLECTION <Text style={styles.sectionCount}>10 / ?</Text>
                        </Text>
                        <View style={styles.titleRow}>
                            {AVAILABLE_TITLES.map((item, index) => (
                                <Text 
                                    key={index}
                                    style={[
                                        styles.titleBadge, 
                                        { backgroundColor: item.color },
                                        currentRole === item.title && styles.selectedTitleBadge,
                                    ]}
                                >
                                    {item.title}
                                </Text>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* BOTTOM NAV */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/furni-home/homesc")}>
                        <Image source={assets.home} style={styles.navImage} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => setShowDialog(true)}>
                        <Image source={assets.bear} style={styles.navImage} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/leaderboard/lead")}>
                        <Image source={assets.trophy} style={styles.navImage} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("../settings/settings")}>
                        <Image source={assets.settings} style={styles.navImage} />
                    </TouchableOpacity>
                </View>

                {/* PixelDialog Modal (Placeholder) */}
                {/* <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} /> */}
                
                {/* TITLE SELECTION MODAL */}
                <Modal visible={showTitleModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.titleModalContent}>
                            <Text style={styles.sectionTitle}>Select Role/Status</Text> 
                            <ScrollView contentContainerStyle={styles.modalScroll}>
                                <View style={styles.titleRow}>
                                    {AVAILABLE_TITLES.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handleRoleSelect(item.title)}
                                            style={styles.titleModalItem}
                                        >
                                            <Text 
                                                style={[
                                                    styles.titleBadge, 
                                                    { backgroundColor: item.color, flexBasis: '100%', margin: 0 },
                                                    currentRole === item.title && styles.selectedTitleBadge,
                                                ]}
                                            >
                                                {item.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowTitleModal(false)}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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
    
    // 💡 NAME EDITING INPUT STYLE
    nameInput: {
        borderBottomWidth: 2,
        borderColor: '#D66878',
        paddingHorizontal: 4,
        paddingVertical: 2,
        minWidth: 100 * SCALE, 
        fontFamily: "jersey15", 
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
        flexWrap: 'wrap', 
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
    
    // 💡 ROLE CONTAINER for clickable region (Focusable area for Role)
    roleContainer: {
        alignSelf: 'flex-start',
        paddingVertical: 2,
    },
    
    editableRole: {
        textDecorationLine: 'underline',
        textDecorationColor: '#333',
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
    
    tierContainer: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
    },

    tierText: {
        fontFamily: "jersey15",
        fontSize: 14 * SCALE,
        marginTop: 4 * SCALE,
        color: '#000',
    },

    italic: {
        fontStyle: "italic",
        fontWeight: 'bold',
        color: '#D66878', 
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
        flexWrap: "wrap", 
        justifyContent: "space-between", 
        paddingBottom: 10 * SCALE, 
    },

    badgeIcon: {
        width: 40 * SCALE,
        height: 40 * SCALE,
    },

    cardIcon: {
        width: 60 * SCALE,
        height: 60 * SCALE,
        borderRadius: 8 * SCALE,
    },

    emptyCard: {
        width: 60 * SCALE,
        height: 60 * SCALE,
        borderRadius: 8 * SCALE,
        backgroundColor: "#eee",
    },

    titleRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
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
        flexBasis: "30%", 
    },
    selectedTitleBadge: {
        borderColor: '#D66878',
        borderWidth: 3,
        shadowColor: '#D66878',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },

    // --- MODAL STYLES (Title Selector) ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleModalContent: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: '#FFF5F5', 
        borderRadius: 15 * SCALE,
        padding: 15 * SCALE,
    },
    modalScroll: {
        flexGrow: 1,
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    titleModalItem: {
        width: '30%', 
        marginBottom: 12,
    },
    modalCloseButton: {
        backgroundColor: "#D66878",
        padding: 12 * SCALE,
        borderRadius: 8,
        marginTop: 15 * SCALE,
        alignItems: 'center',
    },
    modalCloseText: {
        fontFamily: "jersey15",
        fontSize: 16 * SCALE,
        color: 'white',
    },
    
    // --- BOTTOM NAV STYLES ---
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#FFF5F5", 
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
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