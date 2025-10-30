import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCurrency } from "../context/CurrencyContext";

// Modals (Keeping the clean imports from Updated Code)
import PixelDialog from "../memory-modal/popout";
import DailyCheckinModal from "./dailycheckin";
import WeeklyQuestModal from "./weeklyquest";

const assets = {
  avatar: require("@/assets/images/misavatar.png"),
  teddybear: require("@/assets/images/bear.png"),
  misahead: require("@/assets/images/misahead.png"),
  background: require("@/assets/images/homebg.png"),
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
};

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const [greeting, setGreeting] = useState("Good evening! How is your day?");
  const [showGreeting, setShowGreeting] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCurtain, setSelectedCurtain] = useState(-1);
  const [selectedSofa, setSelectedSofa] = useState(-1);

  // ✅ Kept username state
  const [userName, setUserName] = useState("");
  // 💡 NEW STATE: State for the user's role/status
  const [currentRole, setCurrentRole] = useState("Newbie Tester");

  const [showAvatarBubble, setShowAvatarBubble] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showWeeklyQuest, setShowWeeklyQuest] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { currency } = useCurrency();

  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sidebarWidth = useRef(new Animated.Value(56)).current;

  const [fontsLoaded] = useFonts({
    Jersey15: require("@/assets/fonts/Jersey15-Regular.ttf"),
  });

  // Toggle sidebar (Kept original logic for open width)
  const toggleSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: sidebarOpen ? 56 : width - 60, // Original width logic
      duration: 250,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  // Avatar click → show bubble for 4s
  const handleAvatarClick = () => {
    setShowAvatarBubble(true);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setShowAvatarBubble(false);
      bubbleTimeoutRef.current = null;
    }, 4000);
  };

  // Load room layout + username + ROLE from AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const saved = await AsyncStorage.getItem("roomLayout");
          if (saved) {
            const parsed = JSON.parse(saved);
            setSelectedCurtain(parsed?.curtain ?? -1);
            setSelectedSofa(parsed?.sofa ?? -1);
          }

          const storedName = await AsyncStorage.getItem("currentUserName");
          if (storedName) setUserName(storedName);

          // 💡 ADDED: Load the user's current role/status
          const storedRole = await AsyncStorage.getItem("currentRole");
          if (storedRole) {
            setCurrentRole(storedRole);
          } else {
            // Default to Newbie Tester if not found
            setCurrentRole("Newbie Tester");
          }

        } catch (err) {
          console.warn("Failed to load data:", err);
        }
      };
      loadData();
    }, [])
  );

  const furniAssets = {
    sofa: [
      require("@/assets/furnitures/window/sofa_peach.png"),
      require("@/assets/furnitures/window/sofa_grey.png"),
      require("@/assets/furnitures/window/sofa_pastellavender.png"),
      require("@/assets/furnitures/window/sofa_pastelpink.png"),
      require("@/assets/furnitures/window/sofa_green.png"),
      require("@/assets/furnitures/window/sofa_brownbear.png"),
    ],
    curtain: [
      require("@/assets/furnitures/window/curtain_white.png"),
      require("@/assets/furnitures/window/curtain_yellow_pattern.png"),
      require("@/assets/furnitures/window/curtain_pink_stripes.png"),
      require("@/assets/furnitures/window/curtain_blue.png"),
      require("@/assets/furnitures/window/curtain_brown.png"),
    ],
  };

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  return (
    <ImageBackground source={assets.background} style={styles.background}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/*Redirect to profile page on clicking avatar*/}
        <TouchableOpacity onPress={() => router.push("/profile/profilemain")}>
          <Image source={assets.misahead} style={styles.topAvatar} />
        </TouchableOpacity>
        <View style={styles.topInfo}>
          {/* ✅ Use loaded username */}
          <Text style={styles.topName}>{userName || "Misa"}</Text>
          {/* 💡 USE LOADED ROLE */}
          <Text style={styles.topRole}>{currentRole}</Text>
        </View>
        <View style={styles.topStats}>
          <View style={styles.currencyRow}>
            <Image source={assets.currency1} style={styles.currencyIcon} />
            <Text style={styles.stat}>{currency}</Text>
          </View>
          <View style={styles.currencyRow}>
            <Image source={assets.currency2} style={styles.currencyIcon} />
            <Text style={styles.stat}>{currency}</Text>
          </View>
        </View>
      </View>

      {/* Greeting Bar */}
      {showGreeting && (
        <View style={styles.greetingWrapper}>
          {/* ✅ Use loaded username in greeting */}
          <Text style={styles.greetingText}>
            {`Good evening, ${userName || "friend"}! How is your day?`}
          </Text>
          <TouchableOpacity onPress={() => setShowGreeting(false)}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Curtain Layer (Restored Original Positioning/Sizing) */}
      {selectedCurtain >= 0 ? (
        <Image
          source={furniAssets.curtain[selectedCurtain]}
          style={{
            position: "absolute",
            top: 11,
            left: -126,
            width: 900,
            height: 900,
            zIndex: 2,
            resizeMode: "contain",
          }}
        />
      ) : (
        <Image
          source={require("@/assets/furnitures/window/curtains_base.png")}
          style={{
            position: "absolute",
            top: 11,
            left: -126,
            width: 900,
            height: 900,
            zIndex: 1,
            resizeMode: "contain",
          }}
        />
      )}

      {/* Sofa Layer (Restored Original Positioning/Sizing and interaction) */}
      {selectedSofa >= 0 ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setGreeting(`How about taking a rest today, ${userName || "friend"}?`)}
          style={{
            position: "absolute",
            top: 30,
            left: -78,
            width: 830,
            height: 830,
            zIndex: 3,
          }}
        >
          <Image
            source={furniAssets.sofa[selectedSofa]}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </TouchableOpacity>
      ) : (
        <Image
          source={require("@/assets/furnitures/window/sofa_recolours.png")}
          style={{
            position: "absolute",
            top: 30,
            left: -78,
            width: 830,
            height: 830,
            zIndex: 1,
            resizeMode: "contain",
          }}
        />
      )}


      {/* Teddy Bear (Restored Original Positioning/Sizing) */}
      <TouchableOpacity
        onPress={() => setShowDialog(true)}
        style={{ position: "absolute", bottom: 50, left: 20, zIndex: 4 }}
      >
        <Image source={assets.teddybear} style={{ width: 150, height: 150, resizeMode: "contain" }} />
      </TouchableOpacity>


      {/* Avatar (Restored Original Positioning/Sizing) */}
      <View style={styles.avatarContainer}>
        {/* Avatar */}
        <TouchableOpacity
          onPress={handleAvatarClick}
          style={{
            position: "absolute",
            bottom: 30,
            left: -10,
            width: 320,
            height: 220,
            zIndex: 5
          }}
        >
          <Image source={assets.avatar} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
        </TouchableOpacity>

        {/* Bubble (Restored Original Positioning/Sizing) */}
        {showAvatarBubble && (
          <View style={{
            position: "absolute",
            bottom: 200,
            left: 50,
            width: 200,
            backgroundColor: "#FFD1DC",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#D43C67",
            zIndex: 20,
            alignItems: "center"
          }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#D43C67", textAlign: "center" }}>
              Where do I start?
            </Text>
          </View>
        )}

      </View>

      {/* Floating Nav Button (Restored Original Positioning/Sizing) */}
      <TouchableOpacity style={styles.fabNav} onPress={toggleSidebar}>
        <Text style={{ fontSize: 22, color: "#A77C54" }}>
          {sidebarOpen ? "<" : "≡"}
        </Text>
      </TouchableOpacity>

      {/* Sidebar (Restored Original Positioning/Sizing) */}
      {sidebarOpen && (
        <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
          <View style={styles.navRow}>
            {/* Sidebar Buttons (Restored Original Structure/Styling) */}
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/journal")}
            >
              <Image source={assets.moodjournal} style={styles.customIcon} />
              <Text style={styles.navLabel}>mood journal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("../selfcare/journey")}
            >
              <Image source={assets.selfcare} style={styles.customIcon} />
              <Text style={styles.navLabel}>self-care journey</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("../manorpalette/palette")}
            >
              <Image source={assets.palette} style={styles.customIcon} />
              <Text style={styles.navLabel}>manor palette</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("../dailynews/daily")}
            >
              <Image source={assets.dailynews} style={styles.customIcon} />
              <Text style={styles.navLabel}>daily news</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("../leaderboard/lead")}
            >
              <Image source={assets.leaderboard} style={styles.customIcon} />
              <Text style={styles.navLabel}>leader board</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("../tracker")}
            >
              <Image source={assets.extra} style={styles.customIcon} />
              <Text style={styles.navLabel}>luca's tracker</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Edit Button (Restored Original Positioning/Sizing) */}
      <TouchableOpacity
        onPress={() => router.push("/furni-home/homesc2")}
        style={styles.editButton}
      >
        <Image source={assets.edit} style={styles.editLogo} />
      </TouchableOpacity>

      {/* Check-in Button (Restored Original Positioning/Sizing) */}
      <TouchableOpacity
        style={styles.checkinButton}
        onPress={() => setShowCheckin(true)}
      >
        <Image source={assets.checkin} style={styles.checkinIcon} />
      </TouchableOpacity>

      {/* Weekly Quest Button (Restored Original Positioning/Sizing) */}
      <TouchableOpacity
        style={styles.questButton}
        onPress={() => setShowWeeklyQuest(true)}
      >
        <Image source={assets.quest} style={styles.questIcon} />
      </TouchableOpacity>

      {/* Modals (Kept from Updated Code) */}
      <DailyCheckinModal
        visible={showCheckin}
        onClose={() => setShowCheckin(false)}
        name={userName || "Guest"} // Use loaded username
        checkedDays={3}
      />

      <WeeklyQuestModal
        visible={showWeeklyQuest}
        onClose={() => setShowWeeklyQuest(false)}
        name={userName || "Guest"} // Use loaded username
        completedQuests={2}
      />

      <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
    </ImageBackground>
  );
}

// ----------------------------------------------------------------
// MERGED STYLES - Prioritizing Original Code's appearance/layout
// ----------------------------------------------------------------

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  // --- TOP BAR (Original Styling) ---
  topBar: {
    position: "absolute",
    top: 36,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(254, 181, 192, 0.50)",
    paddingVertical: 3,
    paddingHorizontal: 14,
    zIndex: 10,
  },
  topAvatar: {
    width: 60,
    height: 60,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#FEB5C0",
    backgroundColor: "#FEE3B4",
  },
  topInfo: { flex: 1, justifyContent: "center" },
  topName: { color: "#fff", fontSize: 30, marginBottom: 2, fontFamily: "Jersey15" },
  topRole: { color: "#fff", fontSize: 25, fontFamily: "Jersey15" }, // 💡 Using loaded role here
  topStats: { flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 10 },
  currencyRow: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  currencyIcon: { width: 25, height: 25, marginRight: 5, resizeMode: "contain" },
  stat: { color: "#fff", fontSize: 25, fontFamily: "Jersey15" },

  // --- GREETING (Original Styling) ---
  greetingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,192,203,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    position: "absolute",
    top: 110,
    left: 10,
    right: 10,
    zIndex: 50,
  },
  greetingText: { fontWeight: "bold", flex: 1, textAlign: "center" },
  closeButton: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },

  // --- AVATAR & BUBBLE (Original Styling for container, bubble/text styles restored) ---
  avatarContainer: {
    position: "absolute",
    bottom: 80,
    left: 100,
    right: 0,
    alignItems: "center",
    zIndex: 5
  },

  // --- SIDEBAR / FAB (Original Styling) ---
  fabNav: {
    position: "absolute",
    left: 0,
    top: 210,
    width: 40,
    height: 72,
    backgroundColor: "#FCE3CA",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: "#EDD3B8"
  },
  sidebar: {
    position: "absolute",
    left: 36,
    top: 210,
    height: 72,
    backgroundColor: "#FFE9D1",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    zIndex: 19,
    borderWidth: 1,
    borderColor: "#EDD3B8"
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },
  navButton: {
    flex: 1,
    backgroundColor: "#FFEDD8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginHorizontal: 3
  },
  navLabel: {
    fontSize: 10,
    color: "#8C6444",
    textAlign: "center",
    marginTop: 2,
    lineHeight: 12,
    fontWeight: "600"
  },
  customIcon: { width: 24, height: 24, resizeMode: "contain" },

  // --- ACTION BUTTONS (Original Styling) ---
  editButton: { position: "absolute", right: 22, bottom: 22, zIndex: 30 },
  editLogo: { width: 48, height: 48, resizeMode: "contain" },
  checkinButton: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -25 }],
    zIndex: 50,
  },
  checkinIcon: { width: 50, height: 50, resizeMode: "contain" },
  questButton: {
    position: "absolute",
    right: 20,
    top: "50%",
    marginTop: 60,
    zIndex: 50,
  },
  questIcon: { width: 45, height: 45, resizeMode: "contain" },
});