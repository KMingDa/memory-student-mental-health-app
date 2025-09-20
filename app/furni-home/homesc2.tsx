import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const furniAssets = {
  sofa: [
    { color: "#ff6664", asset: require("@/assets/furnitures/window/sofa_peach.png") },
    { color: "#e39271", asset: require("@/assets/furnitures/window/sofa_grey.png") },
    { color: "#ffa5af", asset: require("@/assets/furnitures/window/sofa_pastellavender.png") },
    { color: "#ff836f", asset: require("@/assets/furnitures/window/sofa_pastelpink.png") },
    { color: "#afc154", asset: require("@/assets/furnitures/window/sofa_green.png") },
    { color: "#ff824d", asset: require("@/assets/furnitures/window/sofa_brownbear.png") },
    { reset: true },
  ],
  curtain: [
    { color: "#FFF1D6", asset: require("@/assets/furnitures/window/curtain_white.png") },
    { color: "#FFD36E", asset: require("@/assets/furnitures/window/curtain_yellow_pattern.png") },
    { color: "#EAA2C1", asset: require("@/assets/furnitures/window/curtain_pink_stripes.png") },
    { color: "#8FBCE9", asset: require("@/assets/furnitures/window/curtain_blue.png") },
    { color: "#8C5A4D", asset: require("@/assets/furnitures/window/curtain_brown.png") },
    { reset: true },
  ],
  base: {
    sofa: require("@/assets/furnitures/window/sofa_recolours.png"),
    curtain: require("@/assets/furnitures/window/curtains_base.png"),
  },
};

const bgAsset = require("@/assets/images/homebg.png");
const editIcon = require("@/assets/images/edit.png");

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_WIDTH = SCREEN_WIDTH;
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH * 1.7);

export default function RoomEditor() {
  const [loading, setLoading] = useState(true);
  const [selectedCurtain, setSelectedCurtain] = useState<number>(-1);
  const [selectedSofa, setSelectedSofa] = useState<number>(-1);
  const [editMode, setEditMode] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<"sofa" | "curtain">("sofa");

  const [fontsLoaded] = useFonts({
  Jersey15: require('@/assets/fonts/Jersey15-Regular.ttf'),
});

if (!fontsLoaded) {
  return null; // or a loading indicator if you want
}

  useEffect(() => {
    const loadLayout = async () => {
      try {
        const saved = await AsyncStorage.getItem("roomLayout");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSelectedCurtain(
            typeof parsed?.curtain === "number" && parsed.curtain >= 0 && parsed.curtain < furniAssets.curtain.length
              ? parsed.curtain
              : -1
          );
          setSelectedSofa(
            typeof parsed?.sofa === "number" && parsed.sofa >= 0 && parsed.sofa < furniAssets.sofa.length
              ? parsed.sofa
              : -1
          );
        }
      } catch (err) {
        console.warn("Failed to load layout:", err);
        setSelectedCurtain(-1);
        setSelectedSofa(-1);
      } finally {
        setTimeout(() => setLoading(false), 900);
      }
    };
    loadLayout();
  }, []);

  const saveLayout = async () => {
    await AsyncStorage.setItem("roomLayout", JSON.stringify({ curtain: selectedCurtain, sofa: selectedSofa }));
    setEditMode(false);
    Alert.alert("Saved!", "Your layout has been updated.");
  };

  const handleFurnitureClick = (type: "sofa" | "curtain") => {
    if (editMode) return;
    if (type === "sofa") Alert.alert("🛋 Sofa", "Time to relax on the sofa!");
    if (type === "curtain") Alert.alert("🪟 Curtain", "What a nice view!");
  };

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#D43C67" />
        <Text style={styles.splashText}>Loading room...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ImageBackground source={bgAsset} style={styles.bg} resizeMode="contain">
        {/* Curtains */}
        <View style={styles.curtainWrapper} pointerEvents={editMode ? "none" : "auto"}>
          <Image source={furniAssets.base.curtain} style={styles.curtainImage} resizeMode="contain" />
          {selectedCurtain >= 0 &&
            furniAssets.curtain[selectedCurtain]?.asset && (
              <TouchableOpacity onPress={() => handleFurnitureClick("curtain")} style={styles.curtainOverlayTouch}>
                <Image
                  key={`curtain-${selectedCurtain}`}
                  source={furniAssets.curtain[selectedCurtain].asset}
                  style={[styles.curtainImage, styles.curtainOverlay]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
        </View>

        {/* Sofa */}
        <View style={styles.sofaWrapper} pointerEvents={editMode ? "none" : "auto"}>
          <Image source={furniAssets.base.sofa} style={styles.sofaImage} resizeMode="contain" />
          {selectedSofa >= 0 && furniAssets.sofa[selectedSofa]?.asset && (
            <TouchableOpacity onPress={() => handleFurnitureClick("sofa")} style={StyleSheet.absoluteFill}>
              <Image
                key={`sofa-${selectedSofa}`}
                source={furniAssets.sofa[selectedSofa].asset}
                style={styles.sofaImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

      {/* Bottom cover box */}
      {!editMode && (
        <View style={styles.bottomCover}>
          <Text style={[styles.bottomCoverText, { fontFamily: 'Jersey15' }]}>
            Let's edit your room!
          </Text>
        </View>
      )}

        {/* Edit button */}
        <TouchableOpacity style={styles.editIconBtn} onPress={() => setEditMode(true)}>
          <Image source={editIcon} style={styles.editIcon} />
        </TouchableOpacity>
      </ImageBackground>

      {/* Toolbar anchored to bottom */}
      {editMode && (
        <View style={styles.toolbar}>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => setSelectedFurniture("sofa")}>
              <Text style={[styles.iconLabel, selectedFurniture === "sofa" && styles.activeIcon]}>Sofa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedFurniture("curtain")}>
              <Text style={[styles.iconLabel, selectedFurniture === "curtain" && styles.activeIcon]}>Curtain</Text>
            </TouchableOpacity>
          </View>

          {/* Sofa swatches */}
          {selectedFurniture === "sofa" && (
            <FlatList
              data={furniAssets.sofa}
              keyExtractor={(_, idx) => `sofa-${idx}`}
              numColumns={5}
              contentContainerStyle={styles.swatchGrid}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.swatch,
                    item.reset
                      ? { backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }
                      : { backgroundColor: item.color },
                    index === selectedSofa && styles.activeSwatch,
                  ]}
                  onPress={() => setSelectedSofa(item.reset ? -1 : index)}
                >
                  {item.reset && <Text style={styles.resetText}>X</Text>}
                </TouchableOpacity>
              )}
            />
          )}

          {/* Curtain swatches */}
          {selectedFurniture === "curtain" && (
            <FlatList
              data={furniAssets.curtain}
              keyExtractor={(_, idx) => `curtain-${idx}`}
              numColumns={5}
              contentContainerStyle={styles.swatchGrid}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.swatch,
                    item.reset
                      ? { backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }
                      : { backgroundColor: item.color },
                    index === selectedCurtain && styles.activeSwatch,
                  ]}
                  onPress={() => setSelectedCurtain(item.reset ? -1 : index)}
                >
                  {item.reset && <Text style={styles.resetText}>X</Text>}
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={saveLayout}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFD1DC" },
  bg: { flex: 1, width: CANVAS_WIDTH, alignItems: "center", justifyContent: "flex-start" },

  curtainWrapper: {
    position: "absolute",
    top: CANVAS_HEIGHT * 0.15,
    left: CANVAS_WIDTH * 0.225,
    width: CANVAS_WIDTH * 1.0,
    height: CANVAS_HEIGHT * 1.0,
    zIndex: 2,
  },
  curtainImage: { width: "100%", height: "100%" },
  curtainOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 3 },
  curtainOverlayTouch: { ...StyleSheet.absoluteFillObject, zIndex: 4 },

  sofaWrapper: {
    position: "absolute",
    bottom: CANVAS_HEIGHT * 0.11,
    left: CANVAS_WIDTH * 0.25,
    width: CANVAS_WIDTH * 1.01,
    height: CANVAS_HEIGHT * 1.01,
    zIndex: 9,
  },
  sofaImage: {
    width: "100%",
    height: "100%",
  },

  editIconBtn: { position: "absolute", right: 20, bottom: 42, zIndex: 30 },
  editIcon: { width: 46, height: 46, resizeMode: "contain" },

  bottomCover: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: CANVAS_HEIGHT * 0.19, // adjust to fully cover the white part
    backgroundColor: "#ffdbe6",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 25,
  },
  bottomCoverText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#D43C67",
  },

  toolbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffdbe6",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 15,
    paddingBottom: 30,
    zIndex: 30,
  },

  iconRow: { flexDirection: "row", justifyContent: "space-evenly", marginBottom: 5 },
  iconLabel: { fontSize: 16, fontWeight: "bold", color: "#8C6444" },
  activeIcon: { color: "#D43C67", textDecorationLine: "underline" },

  swatchGrid: { justifyContent: "center", paddingVertical: 10, gap: 8 },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 10,
    margin: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  activeSwatch: { borderColor: "#D43C67", borderWidth: 3 },
  resetText: { fontSize: 18, fontWeight: "bold", color: "#D43C67" },

  saveBtn: {
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: "#D43C67",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  splash: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  splashText: { marginTop: 10, fontSize: 16, color: "#8C6444" },
});