import AsyncStorage from "@react-native-async-storage/async-storage";
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
    { color: "#E78F64", asset: require("@/assets/furnitures/window/sofa_peach.png") },
    { color: "#7A7A7A", asset: require("@/assets/furnitures/window/sofa_grey.png") },
    { color: "#4A7D6B", asset: require("@/assets/furnitures/window/sofa_pastellavender.png") },
    { reset: true }, // Reset option (last)
  ],
  curtain: [
    { color: "#FFF1D6", asset: require("@/assets/furnitures/window/curtain_white.png") },
    { color: "#FFD36E", asset: require("@/assets/furnitures/window/curtain_yellow_pattern.png") },
    { color: "#EAA2C1", asset: require("@/assets/furnitures/window/curtain_pink_stripes.png") },
    { color: "#8FBCE9", asset: require("@/assets/furnitures/window/curtain_blue.png") },
    { color: "#8C5A4D", asset: require("@/assets/furnitures/window/curtain_brown.png") },
    { reset: true }, // Reset option (last)
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
  const [selectedCurtain, setSelectedCurtain] = useState<number>(-1); // -1 = base only
  const [selectedSofa, setSelectedSofa] = useState<number>(-1);
  const [editMode, setEditMode] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<"sofa" | "curtain">("sofa");

  // Load saved layout safely and clamp values
  useEffect(() => {
    const loadLayout = async () => {
      try {
        const saved = await AsyncStorage.getItem("roomLayout");
        if (saved) {
          const parsed = JSON.parse(saved);
          const curtain = parsed?.curtain;
          const sofa = parsed?.sofa;

          if (typeof curtain === "number" && curtain >= 0 && curtain < furniAssets.curtain.length) {
            setSelectedCurtain(curtain);
          } else {
            setSelectedCurtain(-1);
          }

          if (typeof sofa === "number" && sofa >= 0 && sofa < furniAssets.sofa.length) {
            setSelectedSofa(sofa);
          } else {
            setSelectedSofa(-1);
          }
        }
      } catch (err) {
        console.warn("Failed to load layout:", err);
        setSelectedCurtain(-1);
        setSelectedSofa(-1);
      } finally {
        // keep splash for a short moment so background & assets don't flash
        setTimeout(() => setLoading(false), 900);
      }
    };
    loadLayout();
  }, []);

  const saveLayout = async () => {
    await AsyncStorage.setItem(
      "roomLayout",
      JSON.stringify({ curtain: selectedCurtain, sofa: selectedSofa })
    );
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
      <ImageBackground source={bgAsset} style={styles.bg} resizeMode="stretch">
        {/* Curtain wrapper (base + overlay inside) */}
        <View
          style={styles.curtainWrapper}
          pointerEvents={editMode ? "none" : "auto"} // when editing, let toolbar receive touches
        >
          {/* Curtain Base */}
          <Image source={furniAssets.base.curtain} style={styles.curtainImage} resizeMode="contain" />

          {/* Curtain Overlay (render only when asset exists) */}
          {selectedCurtain >= 0 &&
            furniAssets.curtain[selectedCurtain] &&
            furniAssets.curtain[selectedCurtain].asset && (
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

        {/* Sofa wrapper (base + overlay inside) */}
        <View style={styles.sofaWrapper} pointerEvents={editMode ? "none" : "auto"}>
          {/* Sofa Base */}
          <Image source={furniAssets.base.sofa} style={styles.sofaImage} resizeMode="contain" />

          {/* Sofa Overlay */}
          {selectedSofa >= 0 && furniAssets.sofa[selectedSofa] && furniAssets.sofa[selectedSofa].asset && (
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

        {/* Edit icon */}
        <TouchableOpacity style={styles.editIconBtn} onPress={() => setEditMode(true)}>
          <Image source={editIcon} style={styles.editIcon} />
        </TouchableOpacity>

        {/* Toolbar */}
        {editMode && (
          <View style={styles.toolbar}>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => setSelectedFurniture("sofa")}>
                <Text style={[styles.iconLabel, selectedFurniture === "sofa" && styles.activeIcon]}>
                  Sofa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedFurniture("curtain")}>
                <Text style={[styles.iconLabel, selectedFurniture === "curtain" && styles.activeIcon]}>
                  Curtain
                </Text>
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f6f2ef" },
  bg: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, position: "relative" },

  // curtain wrapper: exact top/left and size that match previous curtainLayer values
  curtainWrapper: {
    position: "absolute",
    top: CANVAS_HEIGHT * 0.02,
    left: CANVAS_WIDTH * 0.13,
    width: CANVAS_WIDTH * 1.21,
    height: CANVAS_HEIGHT * 1.0,
    zIndex: 2,
  },
  curtainImage: {
    width: "100%",
    height: "100%",
  },
  curtainOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 3,
  },
  curtainOverlayTouch: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },

  // sofa wrapper same as before but now with explicit width/height so base + overlay align
  sofaWrapper: {
    position: "absolute",
    bottom: -CANVAS_HEIGHT * 0.1,
    left: CANVAS_WIDTH * 0.18,
    width: CANVAS_WIDTH * 1.15,
    height: CANVAS_HEIGHT * 1.15,
    zIndex: 9,
  },
  sofaImage: {
    width: "100%",
    height: "100%",
  },

  editIconBtn: { position: "absolute", right: 20, bottom: 20, zIndex: 30 },
  editIcon: { width: 46, height: 46, resizeMode: "contain" },

  toolbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ffdbe6",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    paddingTop: 10,
    zIndex: 20, // ensure toolbar visually above everything
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },

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
  activeSwatch: {
    borderColor: "#D43C67",
    borderWidth: 3,
  },

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

  // splash
  splash: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8C6444",
  },
});