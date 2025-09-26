// app/selfcare/journey.tsx
import Slider from "@react-native-community/slider";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// --- LOCAL IMAGE ASSETS ---
const AVATAR = require("../../assets/images/misavatar.png");

// Lofi Tracks
const LOFI1 = require("../../assets/images/melody.jpg");
const LOFI2 = require("../../assets/images/bunny.jpg");
const LOFI3 = require("../../assets/images/sheep.jpg");

// Exercise
const EX1 = require("../../assets/images/exercise1.jpg");
const EX2 = require("../../assets/images/exercise2.png");

// BGMs
const BGM1 = require("../../assets/images/bgm1.jpg");
const BGM2 = require("../../assets/images/bgm2.jpg");

// Player icons
const ARROW = require("../../assets/images/arrow.png");
const PREVIOUS = require("../../assets/images/previous.png");
const PLAY = require("../../assets/images/play.png");
const PAUSE = require("../../assets/images/pause.png");
const ADVANCE = require("../../assets/images/advance.png");
const REPEAT = require("../../assets/images/repeat.png");
const DOWN = require("../../assets/images/down.png");

// --- TYPES ---
type Track = {
  id: string;
  title: string;
  artist: string;
  image: any;
  progress: number;
  playing: boolean;
};

// --- SAMPLE DATA ---
const sampleTopLofi: Track[] = [
  { id: "1", title: "Counting Sheeps", artist: "sanrio ltd", image: LOFI1, progress: 0, playing: false },
  { id: "2", title: "Bunny! Bunny!", artist: "sanrio ltd", image: LOFI2, progress: 0, playing: false },
  { id: "3", title: "Sleepy Melody", artist: "sanrio ltd", image: LOFI3, progress: 0, playing: false },
];

const sampleExercise = [
  { id: "e1", title: "10 steps to a relaxed body!", image: EX1 },
  { id: "e2", title: "Rest Better Within", image: EX2 },
];

const sampleBGMs = [
  { id: "b1", title: "Cherry Garden Walk", image: BGM1 },
  { id: "b2", title: "Bridge by the Lake", image: BGM2 },
];

// ---------- COMPONENTS ----------
const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerDate}>{new Date().toLocaleDateString()}</Text>
    <Image source={AVATAR} style={styles.avatar} />
  </View>
);

// --- SEARCH BAR ---
const SearchBar = () => (
  <View style={styles.searchRow}>
    <Image source={require("../../assets/images/fireplace.png")} style={styles.fireIconImg} />
    <TextInput
      placeholder="Search"
      style={styles.searchInputRect}
      placeholderTextColor="#999"
    />
  </View>
);

// --- FILTER CHIPS ---
const FilterChips = () => {
  const chips = ["All", "Music", "Podcast", "Video"];
  return (
    <View style={styles.filterRowFlex}>
      {chips.map((chip, i) => (
        <TouchableOpacity
          key={chip}
          style={[
            styles.chipFlex,
            i === 0 ? styles.chipActive : styles.chipInactive,
            { flex: i === 0 ? 1.5 : 1 },
          ]}
        >
          <Text style={i === 0 ? styles.chipTextActive : styles.chipText}>{chip}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// --- HOME SCREEN ---
function HomeScreen({ navigation }: any) {
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: "track1",
    title: "Bunny!Bunny!",
    artist: "sanrio ltd",
    image: LOFI1,
    progress: 0.25,
    playing: false,
  });

  const togglePlay = () => setCurrentTrack((t) => ({ ...t, playing: !t.playing }));
  const openDetail = (track: Track) => navigation.navigate("PlayerDetail", { track });

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity onPress={() => setCurrentTrack(item)} style={styles.listItem}>
      <Image source={item.image} style={styles.thumbSmall} resizeMode="cover" />
      <View style={{ marginLeft: 8, flex: 1 }}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemSub}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <SearchBar />
      <FilterChips />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* TOP Lofi Music */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOP Lofi Music</Text>
          <FlatList
            data={sampleTopLofi}
            horizontal
            keyExtractor={(i) => i.id}
            renderItem={renderTrackItem}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            contentContainerStyle={{ paddingLeft: 8 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* TOP Exercise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOP Exercise Regime</Text>
          <FlatList
            data={sampleExercise}
            horizontal
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.exerciseCard}>
                <Image source={item.image} style={styles.exerciseImage} resizeMode="cover" />
                <Text style={styles.exerciseText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            contentContainerStyle={{ paddingLeft: 8 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* TOP BGMs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOP Relaxing BGMs</Text>
          <FlatList
            data={sampleBGMs}
            horizontal
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.bgmCard}>
                <Image source={item.image} style={styles.bgmImage} resizeMode="cover" />
                <Text style={styles.bgmText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            contentContainerStyle={{ paddingLeft: 8 }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* MINI PLAYER */}
      <TouchableOpacity
        style={[styles.miniPlayer, { bottom: 60 }]}
        onPress={() => openDetail(currentTrack)}
      >
        <Image source={currentTrack.image} style={styles.miniThumb} resizeMode="cover" />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.miniTitle} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.miniArtist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
        <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
          <Image
            source={currentTrack.playing ? PAUSE : PLAY}
            style={{ width: 28, height: 28, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <Image source={require("../../assets/images/home.png")} style={styles.icon} />
        <Image source={require("../../assets/images/bear.png")} style={styles.icon} />
        <Image source={require("../../assets/images/trophy.png")} style={styles.icon} />
        <Image source={require("../../assets/images/settings.png")} style={styles.icon} />
      </View>
    </SafeAreaView>
  );
}

// --- PLAYER DETAIL SCREEN ---
function PlayerDetail({ route, navigation }: any) {
  const { track } = route.params;
  const [playing, setPlaying] = useState(track.playing);
  const [progress, setProgress] = useState(track.progress);

  const togglePlay = () => setPlaying((p:boolean) => !p);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Top Down Button */}
        <TouchableOpacity
          style={styles.downButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={DOWN} style={styles.downIcon} />
        </TouchableOpacity>

        <Image source={track.image} style={styles.largeArt} resizeMode="cover" />

        <Text style={styles.detailTitle}>{track.title}</Text>
        <Text style={styles.detailArtist}>{track.artist}</Text>

        {/* Slider */}
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={progress}
          onValueChange={setProgress}
          style={styles.slider}
        />

        {/* Time labels */}
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>0:00</Text>
          <Text style={styles.timeText}>3:30</Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlRow}>
          <TouchableOpacity><Image source={ARROW} style={styles.controlIcon} /></TouchableOpacity>
          <TouchableOpacity><Image source={PREVIOUS} style={styles.controlIcon} /></TouchableOpacity>
          <TouchableOpacity onPress={togglePlay}><Image source={playing ? PAUSE : PLAY} style={styles.playIcon} /></TouchableOpacity>
          <TouchableOpacity><Image source={ADVANCE} style={styles.controlIcon} /></TouchableOpacity>
          <TouchableOpacity><Image source={REPEAT} style={styles.controlIcon} /></TouchableOpacity>
        </View>

        {/* About Artist */}
        <View style={styles.aboutArtistBox}>
          <ScrollView>
            <Text style={styles.aboutArtistText}>
              Counting Sheeps is a relaxing lofi track produced by Sanrio Ltd, the creators of Hello Kitty. This track features soothing melodies and gentle beats designed to help you unwind and relax. Perfect for studying, working, or simply taking a moment to yourself. Let the calming sounds of Counting Sheeps transport you to a peaceful state of mind.
            </Text>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <Image source={require("../../assets/images/home.png")} style={styles.icon} />
        <Image source={require("../../assets/images/bear.png")} style={styles.icon} />
        <Image source={require("../../assets/images/trophy.png")} style={styles.icon} />
        <Image source={require("../../assets/images/settings.png")} style={styles.icon} />
      </View>
    </SafeAreaView>
  );
}

// --- STACK ---
const Stack = createStackNavigator();
export default function JourneyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PlayerDetail" component={PlayerDetail} />
    </Stack.Navigator>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#DFF6F9" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, backgroundColor: "#FDE8EC" },
  headerDate: { fontWeight: "700", color: "#000", fontFamily: "Jersey20-Regular" },
  avatar: { width: 40, height: 40, borderRadius: 8 },

  searchRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8 },
  fireIconImg: { width: 24, height: 24, marginRight: 8, resizeMode: "contain" },
  searchInputRect: { flex: 1, height: 42, backgroundColor: "#EAF6F8", borderRadius: 8, paddingHorizontal: 12, fontSize: 16, fontFamily: "Jersey20-Regular" },

  filterRowFlex: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 8 },
  chipFlex: { height: 32, borderRadius: 16, borderWidth: 1, justifyContent: "center", alignItems: "center", marginHorizontal: 4 },
  chipActive: { backgroundColor: "#BEEAF0", borderColor: "#6BCEDB" },
  chipInactive: { backgroundColor: "#E9F8FA", borderColor: "#CDEFF4" },
  chipTextActive: { color: "#2E6F79", fontWeight: "700", fontFamily: "Jersey20-Regular" },
  chipText: { color: "#2E6F79", fontFamily: "Jersey20-Regular" },

  section: { marginTop: 10 },
  sectionTitle: { fontWeight: "800", marginLeft: 12, marginBottom: 8, fontFamily: "Jersey20-Regular" },
  listItem: { width: 260, height: 70, backgroundColor: "#fff", borderRadius: 8, padding: 8, flexDirection: "row", alignItems: "center" },
  thumbSmall: { width: 54, height: 54, borderRadius: 6 },
  itemTitle: { fontWeight: "700", fontFamily: "Jersey20-Regular" },
  itemSub: { color: "#666", fontSize: 12, fontFamily: "Jersey20-Regular" },

  exerciseCard: { width: 180, backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", elevation: 2 },
  exerciseImage: { width: "100%", height: 100 },
  exerciseText: { padding: 8, fontWeight: "600", fontFamily: "Jersey20-Regular" },

  bgmCard: { width: 180, backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", elevation: 2 },
  bgmImage: { width: "100%", height: 100, borderRadius: 6 },
  bgmText: { padding: 8, fontWeight: "600", fontFamily: "Jersey20-Regular" },

  miniPlayer: { position: "absolute", width: "100%", height: 64, backgroundColor: "#a4d1d2ff", borderRadius: 0, padding: 8, flexDirection: "row", alignItems: "center", elevation: 8, zIndex: 20, bottom: 60 },
  miniThumb: { width: 48, height: 48, borderRadius: 6 },
  miniTitle: { fontWeight: "700", fontFamily: "Jersey20-Regular" },
  miniArtist: { fontSize: 12, color: "#333", fontFamily: "Jersey20-Regular" },
  playButton: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },

  bottomMenu: { flexDirection: "row", justifyContent: "space-around", width: "100%", position: "absolute", bottom: 0, paddingVertical: 10, borderTopWidth: 1, borderColor: "#ffffff", backgroundColor: "#fff", zIndex: 10 },
  icon: { width: 32, height: 32, resizeMode: "contain" },

  largeArt: { width: 300, height: 300, borderRadius: 12, alignSelf: "center", marginTop: 40 },
  detailTitle: { fontSize: 18, fontWeight: "800", marginTop: 12, fontFamily: "Jersey20-Regular" },
  detailArtist: { fontSize: 12, marginTop: 4, color: "#333", fontWeight: "700", fontFamily: "Jersey20-Regular" },

  slider: { width: width - 64, height: 40, alignSelf: "center", marginTop: 16 },
  timeRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 32 },
  timeText: { fontSize: 12, color: "#333", fontFamily: "Jersey20-Regular" },

  controlRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 16 },
  controlIcon: { width: 28, height: 28, resizeMode: "contain" },
  playIcon: { width: 36, height: 36, resizeMode: "contain" },

  downButton: { position: "absolute", top: 16, left: 16, zIndex: 20 },
  downIcon: { width: 28, height: 28, resizeMode: "contain" },

  aboutArtistBox: { marginTop: 60, backgroundColor: "#fff", padding: 12, borderRadius: 12, maxHeight: 120 },
  aboutArtistText: { fontSize: 16, fontFamily: "Jersey20-Regular", color: "#333" },
});