import { Ionicons } from "@expo/vector-icons";
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
  edit: require("../../assets/images/edit.png"), // <-- Added EDIT logo
};

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [greeting, setGreeting] = useState("Good evening! How is your day?");
  const [showGreeting, setShowGreeting] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Animation for sidebar width (not strictly required for floating nav)
  const sidebarWidth = React.useRef(new Animated.Value(56)).current;

  const toggleSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: sidebarOpen ? 56 : 380, // Wider for horizontal nav
      duration: 250,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

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
            {/* Move close X absolutely to top-right corner */}
            <TouchableOpacity
              onPress={() => setShowGreeting(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={18} color="#444" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating Nav Button - Always Visible */}
      <TouchableOpacity style={styles.fabNav} onPress={toggleSidebar}>
        <Ionicons name={sidebarOpen ? "chevron-back" : "menu"} size={28} color="#A77C54" />
      </TouchableOpacity>

      {/* Avatar at Bottom Center */}
      <View style={styles.avatarContainer}>
        <Image source={assets.avatar} style={styles.avatar} />
      </View>

      {/* Optionally, expanded sidebar icons (horizontal now) */}
      {sidebarOpen && (
        <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="book" size={28} color="#8C6444" />
              <Text style={styles.navLabel}>mood{"\n"}journal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="flame" size={28} color="#C15C2B" />
              <Text style={styles.navLabel}>self-care{"\n"}journey</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="color-palette" size={28} color="#489FC9" />
              <Text style={styles.navLabel}>“manor{"\n"}palette”</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="newspaper" size={28} color="#8C6444" />
              <Text style={styles.navLabel}>daily{"\n"}news</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="trophy" size={28} color="#E8B13C" />
              <Text style={styles.navLabel}>leader{"\n"}board</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Edit Logo at Bottom Right */}
      <Image source={assets.edit} style={styles.editLogo} />
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
    backgroundColor: "rgba(40, 30, 50, 0.55)",
    borderRadius: 0,
    marginHorizontal: 0,
    paddingVertical: 10,
    paddingHorizontal: 14,
    zIndex: 10,
  },
  topAvatar: {
    width: 54,
    height: 54,
    borderRadius: 0,
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
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 2,
  },
  topRole: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.79,
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
    width: 22,
    height: 22,
    marginRight: 5,
    resizeMode: "contain",
  },
  stat: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
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
    backgroundColor: "#FEB5C0",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#dacbcbff",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: "relative", // <--- Needed for absolute position of closeButton
  },
  greetingText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 18,
    flex: 1,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  closeButton: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    padding: 0,
  },
  fabNav: {
    position: "absolute",
    left: 0,
    top: 210,
    width: 40,
    height: 72,
    backgroundColor: "#FCE3CA", // soft pastel as in image
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EDD3B8",
    padding: 0,
  },
  sidebar: {
    position: "absolute",
    left: 36, // just after the fabNav
    top: 210,
    width: 380, // room for 5 icons with gaps
    height: 96,
    backgroundColor: "#FFE9D1",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    zIndex: 19,
    borderWidth: 1,
    borderColor: "#EDD3B8",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    gap: 18,
  },
  navButton: {
    backgroundColor: "#FFEDD8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 60,
    minHeight: 72,
    marginHorizontal: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  navLabel: {
    fontSize: 11,
    color: "#8C6444",
    textAlign: "center",
    marginTop: 3,
    lineHeight: 13,
    fontWeight: "600",
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
  editLogo: {
    position: "absolute",
    right: 22,
    bottom: 22,
    width: 48,
    height: 48,
    resizeMode: "contain",
    zIndex: 30,
  },
});