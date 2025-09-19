import { useFonts } from "expo-font";
import { useRouter } from "expo-router"; // navigation
import React, { useState } from "react";
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

// Main assets
const assets = {
  avatar: require("@/assets/images/misavatar.png"),
  misahead: require("@/assets/images/misahead.png"),
  background: require("@/assets/images/homebg.png"),
  currency1: require("../../assets/images/currency1.png"),
  currency2: require("../../assets/images/currency2.png"),
  edit: require("../../assets/images/edit.png"),

  // Custom sidebar icons
  leaderboard: require("../../assets/images/leaderboard.png"),
  selfcare: require("../../assets/images/selfcare.png"),
  palette: require("../../assets/images/palette.png"),
  moodjournal: require("../../assets/images/moodjournal.png"),
  dailynews: require("../../assets/images/dailynews.png"),
  extra: require("../../assets/images/currency1.png"), // placeholder for 6th icon
};

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [greeting, setGreeting] = useState("Good evening! How is your day?");
  const [showGreeting, setShowGreeting] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Jersey15: require("@/assets/fonts/Jersey15-Regular.ttf"),
  });

  const sidebarWidth = React.useRef(new Animated.Value(56)).current;

  const toggleSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: sidebarOpen ? 56 : width - 60,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <ImageBackground source={assets.background} style={styles.background}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image source={assets.misahead} style={styles.topAvatar} />
        <View style={styles.topInfo}>
          <Text style={styles.topName}>Misa</Text>
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

      {/* Greeting Box */}
      {showGreeting && (
        <View style={styles.greetingBoxWrapper}>
          <View style={styles.greetingBox}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <TouchableOpacity
              onPress={() => setShowGreeting(false)}
              style={styles.closeButton}
            >
              <Text style={{ fontSize: 18, color: "#444" }}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating Nav Button */}
      <TouchableOpacity style={styles.fabNav} onPress={toggleSidebar}>
        <Text style={{ fontSize: 22, color: "#A77C54" }}>
          {sidebarOpen ? "<" : "≡"}
        </Text>
      </TouchableOpacity>

      {/* Avatar at Bottom Center */}
      <View style={styles.avatarContainer}>
        <Image source={assets.avatar} style={styles.avatar} />
      </View>

      {/* Sidebar */}
      {sidebarOpen && (
        <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.navButton}>
              <Image source={assets.moodjournal} style={styles.customIcon} />
              <Text style={styles.navLabel}>mood journal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <Image source={assets.selfcare} style={styles.customIcon} />
              <Text style={styles.navLabel}>self-care journey</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <Image source={assets.palette} style={styles.customIcon} />
              <Text style={styles.navLabel}>manor palette</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <Image source={assets.dailynews} style={styles.customIcon} />
              <Text style={styles.navLabel}>daily news</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <Image source={assets.leaderboard} style={styles.customIcon} />
              <Text style={styles.navLabel}>leader board</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
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
  topInfo: {
    flex: 1,
    justifyContent: "center",
  },
  topName: {
    color: "#fff",
    fontSize: 30,
    marginBottom: 2,
    fontFamily: "Jersey15",
  },
  topRole: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Jersey15",
  },
  topStats: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
    marginLeft: 10,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  currencyIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
    resizeMode: "contain",
  },
  stat: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Jersey15",
  },
  greetingBoxWrapper: {
    position: "absolute",
    top: 122,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 13,
  },
  greetingBox: {
    flex: 1,
    marginHorizontal: 18,
    backgroundColor: "rgba(254, 181, 192, 0.78)",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#dacbcbff",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  greetingText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 23,
    flex: 1,
    textAlign: "center",
    fontFamily: "Jersey15",
  },
  closeButton: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
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
    borderColor: "#EDD3B8",
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
    borderColor: "#EDD3B8",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  navButton: {
    flex: 1,
    backgroundColor: "#FFEDD8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginHorizontal: 3,
  },
  navLabel: {
    fontSize: 10,
    color: "#8C6444",
    textAlign: "center",
    marginTop: 2,
    lineHeight: 12,
    fontWeight: "600",
  },
  customIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  avatarContainer: {
    position: "absolute",
    bottom: 80,
    left: 90,
    right: 0,
    alignItems: "center",
    zIndex: 5,
  },
  avatar: {
    width: 320,
    height: 220,
    resizeMode: "contain",
  },
  editButton: {
    position: "absolute",
    right: 22,
    bottom: 22,
    zIndex: 30,
  },
  editLogo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});