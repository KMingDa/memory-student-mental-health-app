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

// Modals
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
  const [userName, setUserName] = useState("");

  const [showAvatarBubble, setShowAvatarBubble] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showWeeklyQuest, setShowWeeklyQuest] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // ✅ FIX: Cross-platform safe typing for timeout (works on iOS/Android/Web)
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sidebarWidth = useRef(new Animated.Value(56)).current;

  const [fontsLoaded] = useFonts({
    Jersey15: require("@/assets/fonts/Jersey15-Regular.ttf"),
  });

  // Toggle sidebar
  const toggleSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: sidebarOpen ? 56 : width - 60,
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

  // Load room layout + username from AsyncStorage
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
        <TouchableOpacity onPress={() => router.push("/profile/profilemain")}>
          <Image source={assets.misahead} style={styles.topAvatar} />
        </TouchableOpacity>

        <View style={styles.topInfo}>
          <Text style={styles.topName}>{userName || "Guest"}</Text>
          <Text style={styles.topRole}>Newbie Tester</Text>
        </View>

        <View style={styles.topStats}>
          <View style={styles.currencyRow}>
            <Image source={assets.currency1} style={styles.currencyIcon} />
            <Text style={styles.stat}>1200</Text>
          </View>
          <View style={styles.currencyRow}>
            <Image source={assets.currency2} style={styles.currencyIcon} />
            <Text style={styles.stat}>1500</Text>
          </View>
        </View>
      </View>

      {/* Greeting */}
      {showGreeting && (
        <View style={styles.greetingWrapper}>
          <Text style={styles.greetingText}>
            {`Good evening, ${userName || "Guest"}! How is your day?`}
          </Text>
          <TouchableOpacity onPress={() => setShowGreeting(false)}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Curtains */}
      <Image
        source={
          selectedCurtain >= 0
            ? furniAssets.curtain[selectedCurtain]
            : require("@/assets/furnitures/window/curtains_base.png")
        }
        style={styles.curtainImage}
      />

      {/* Sofa */}
      {selectedSofa >= 0 ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setGreeting(`Take a break, ${userName || "friend"}!`)}
          style={styles.sofaTouchable}
        >
          <Image
            source={furniAssets.sofa[selectedSofa]}
            style={styles.sofaImage}
          />
        </TouchableOpacity>
      ) : (
        <Image
          source={require("@/assets/furnitures/window/sofa_recolours.png")}
          style={styles.sofaImage}
        />
      )}

      {/* Teddy */}
      <TouchableOpacity
        onPress={() => setShowDialog(true)}
        style={{ position: "absolute", bottom: 50, left: 20, zIndex: 4 }}
      >
        <Image
          source={assets.teddybear}
          style={{ width: 150, height: 150, resizeMode: "contain" }}
        />
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleAvatarClick} style={styles.avatarTouchable}>
          <Image
            source={assets.avatar}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </TouchableOpacity>

        {showAvatarBubble && (
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Where do I start?</Text>
          </View>
        )}
      </View>

      {/* Floating Nav Button */}
      <TouchableOpacity style={styles.fabNav} onPress={toggleSidebar}>
        <Text style={{ fontSize: 22, color: "#A77C54" }}>
          {sidebarOpen ? "<" : "≡"}
        </Text>
      </TouchableOpacity>

      {/* Sidebar */}
      {sidebarOpen && (
        <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push("/journal")}
            >
              <Image source={assets.moodjournal} style={styles.customIcon} />
              <Text style={styles.navLabel}>mood journal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
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

      {/* Edit Button */}
      <TouchableOpacity
        onPress={() => router.push("/furni-home/homesc2")}
        style={styles.editButton}
      >
        <Image source={assets.edit} style={styles.editLogo} />
      </TouchableOpacity>

      {/* Check-in */}
      <TouchableOpacity
        style={styles.checkinButton}
        onPress={() => setShowCheckin(true)}
      >
        <Image source={assets.checkin} style={styles.checkinIcon} />
      </TouchableOpacity>

      {/* Quest */}
      <TouchableOpacity
        style={styles.questButton}
        onPress={() => setShowWeeklyQuest(true)}
      >
        <Image source={assets.quest} style={styles.questIcon} />
      </TouchableOpacity>

      {/* Modals */}
      <DailyCheckinModal
        visible={showCheckin}
        onClose={() => setShowCheckin(false)}
        name={userName || "Guest"}
        checkedDays={3}
      />

      <WeeklyQuestModal
        visible={showWeeklyQuest}
        onClose={() => setShowWeeklyQuest(false)}
        name={userName || "Guest"}
        completedQuests={2}
      />

      <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 30,
  },
  topAvatar: { width: 55, height: 55, borderRadius: 30 },
  topInfo: { flex: 1, marginLeft: 10 },
  topName: { fontSize: 16, color: "#fff", fontFamily: "Jersey15" },
  topRole: { fontSize: 12, color: "#d0d0d0", fontFamily: "Jersey15" },
  topStats: { flexDirection: "row", alignItems: "center" },
  currencyRow: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  currencyIcon: { width: 20, height: 20, marginRight: 4 },
  stat: { color: "#fff", fontSize: 14, fontFamily: "Jersey15" },
  greetingWrapper: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  greetingText: { color: "#fff", flex: 1, fontFamily: "Jersey15" },
  closeButton: { color: "#fff", fontSize: 18, marginLeft: 10 },
  curtainImage: {
    position: "absolute",
    top: 100,
    left: 0,
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  sofaTouchable: { position: "absolute", bottom: 80, alignSelf: "center" },
  sofaImage: {
    width: 260,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
  },
  avatarContainer: {
    position: "absolute",
    bottom: 130,
    right: 30,
    width: 120,
    height: 120,
  },
  avatarTouchable: { width: "100%", height: "100%" },
  bubble: {
    position: "absolute",
    bottom: 120,
    right: 0,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 8,
  },
  bubbleText: { fontFamily: "Jersey15", fontSize: 12, color: "#000" },
  fabNav: {
    position: "absolute",
    bottom: 50,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  sidebar: {
    position: "absolute",
    right: 0,
    bottom: 100,
    top: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  navRow: { gap: 15 },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  customIcon: { width: 30, height: 30 },
  navLabel: { fontFamily: "Jersey15", fontSize: 14, color: "#333" },
  editButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },
  editLogo: { width: 30, height: 30 },
  checkinButton: { position: "absolute", bottom: 200, right: 25 },
  checkinIcon: { width: 50, height: 50 },
  questButton: { position: "absolute", bottom: 260, right: 25 },
  questIcon: { width: 50, height: 50 },
});