import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
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
    { color: "#E78F64", asset: require("@/assets/furnitures/window/sofa_brownbear.png") }, // forced asset
  ],
  pillow: [
    { color: "#F5E6CC", asset: require("@/assets/furnitures/window/pillow_base.png") }, // forced asset
  ],
  curtain: [
    { color: "#FFF1D6", asset: require("@/assets/furnitures/window/curtain_white.png") },
    { color: "#FFD36E", asset: require("@/assets/furnitures/window/curtain_yellow_pattern.png") },
    { color: "#EAA2C1", asset: require("@/assets/furnitures/window/curtain_pink_stripes.png") },
    { color: "#8FBCE9", asset: require("@/assets/furnitures/window/curtain_blue.png") },
    { color: "#8C5A4D", asset: require("@/assets/furnitures/window/curtain_brown.png") },
  ],
};

const bgAsset = require("@/assets/images/homebg.png");
const editIcon = require("@/assets/images/edit.png");

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_WIDTH = SCREEN_WIDTH;
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH * 1.7);

export default function RoomEditor() {
  const [selectedCurtain, setSelectedCurtain] = useState<number>(0); // show first curtain by default
  const [editMode, setEditMode] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<"sofa" | "pillow" | "curtain">("sofa");

  // Load saved layout
  useEffect(() => {
    const loadLayout = async () => {
      const saved = await AsyncStorage.getItem("roomLayout");
      if (saved) {
        const { curtain } = JSON.parse(saved);
        if (curtain !== null) setSelectedCurtain(curtain);
      }
    };
    loadLayout();
  }, []);

  const saveLayout = async () => {
    await AsyncStorage.setItem(
      "roomLayout",
      JSON.stringify({ curtain: selectedCurtain })
    );
    setEditMode(false);
    Alert.alert("Saved!", "Your layout has been updated.");
  };

  const handleFurnitureClick = (type: "sofa" | "pillow" | "curtain") => {
    if (editMode) return;
    if (type === "pillow") Alert.alert("💤 Pillow", "How about taking a nap?");
    if (type === "sofa") Alert.alert("🛋 Sofa", "Time to relax on the sofa!");
    if (type === "curtain") Alert.alert("🪟 Curtain", "What a nice view!");
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={bgAsset} style={styles.bg} resizeMode="cover">

        {/* Curtain */}
        <TouchableOpacity onPress={() => handleFurnitureClick("curtain")}>
          <Image
            source={furniAssets.curtain[selectedCurtain].asset}
            style={styles.curtainLayer}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Sofa - always visible for positioning */}
        <TouchableOpacity onPress={() => handleFurnitureClick("sofa")}>
          <Image
            source={furniAssets.sofa[0].asset}
            style={styles.sofaLayer}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Pillow - always visible for positioning */}
        <TouchableOpacity onPress={() => handleFurnitureClick("pillow")}>
          <Image
            source={furniAssets.pillow[0].asset}
            style={styles.pillowLayer}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Edit icon */}
        <TouchableOpacity style={styles.editIconBtn} onPress={() => setEditMode(true)}>
          <Image source={editIcon} style={styles.editIcon} />
        </TouchableOpacity>

        {/* Toolbar */}
        {editMode && (
          <View style={styles.toolbar}>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => setSelectedFurniture("sofa")}>
                <Text style={[styles.iconLabel, selectedFurniture === "sofa" && styles.activeIcon]}>Sofa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedFurniture("pillow")}>
                <Text style={[styles.iconLabel, selectedFurniture === "pillow" && styles.activeIcon]}>Pillow</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedFurniture("curtain")}>
                <Text style={[styles.iconLabel, selectedFurniture === "curtain" && styles.activeIcon]}>Curtain</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={furniAssets[selectedFurniture]}
              keyExtractor={(_, idx) => idx.toString()}
              numColumns={5}
              contentContainerStyle={styles.swatchGrid}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.swatch,
                    { backgroundColor: item.color },
                  ]}
                  onPress={() => {
                    if (selectedFurniture === "curtain") setSelectedCurtain(index);
                  }}
                />
              )}
            />

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
  bg: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
  curtainLayer: {
    position: "absolute",
    top: -CANVAS_HEIGHT * 0.06,
    left: CANVAS_WIDTH * 0.18,
    width: CANVAS_WIDTH * 1.15,
    height: CANVAS_HEIGHT * 1.15,
    zIndex: 2,
  },
  sofaLayer: {
    position: "absolute",
    bottom: 100,      // adjustable for editing
    left: 50,         // adjustable
    width: 500,       // forced large size
    height: 300,      // forced large size
    zIndex: 3,      // always on top
  },
  pillowLayer: {
    position: "absolute",
    bottom: 200,      // adjustable
    left: 200,        // adjustable
    width: 200,
    height: 150,
    zIndex: 5,
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
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  iconLabel: { fontSize: 16, fontWeight: "bold", color: "#8C6444" },
  activeIcon: { color: "#D43C67", textDecorationLine: "underline" },
  swatchGrid: {
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 10,
    margin: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  saveBtn: {
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: "#D43C67",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});