import Slider from "@react-native-community/slider";
import { createStackNavigator } from "@react-navigation/stack";
import { Audio } from 'expo-av';
import { useFonts } from "expo-font";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
// Note: Assuming these assets are correctly located relative to this file
const AVATAR = require("../../assets/images/misahead.png"); 
const HOME_ICON = require('@/assets/images/home.png');
const BEAR_ICON = require('@/assets/images/bear.png');
const TROPHY_ICON = require('@/assets/images/trophy.png');
const SETTINGS_ICON = require('@/assets/images/settings.png');

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

// --- NEW AUDIO ASSET ---
const SAMPLE_AUDIO = require("../../assets/audio/sample.mp3");

// --- TYPES ---
type Track = {
    id: string;
    title: string;
    artist: string;
    image: any;
    progress: number;
    playing: boolean;
    source: any;
};

// --- DATE FORMATTING FUNCTION ---
const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).replace(/ /g, ' '); 
};

const formattedDate = getFormattedDate(); 

// --- SAMPLE DATA ---
const sampleTopLofi: Track[] = [
    { id: "1", title: "Counting Sheeps", artist: "sanrio ltd", image: LOFI1, progress: 0, playing: false, source: SAMPLE_AUDIO },
    { id: "2", title: "Bunny! Bunny!", artist: "sanrio ltd", image: LOFI2, progress: 0, playing: false, source: SAMPLE_AUDIO },
    { id: "3", title: "Sleepy Melody", artist: "sanrio ltd", image: LOFI3, progress: 0, playing: false, source: SAMPLE_AUDIO },
];

const sampleExercise = [
    { id: "e1", title: "10 steps to a relaxed body!", image: EX1 },
    { id: "e2", title: "Rest Better Within", image: EX2 },
];

const sampleBGMs = [
    { id: "b1", title: "Cherry Garden Walk", image: BGM1 },
    { id: "b2", title: "Bridge by the Lake", image: BGM2 },
];

// ************************************************************
// 🚀 1. PLAYBACK CONTEXT DEFINITION
// ************************************************************
type PlaybackContextType = {
    currentTrack: Track;
    togglePlay: () => Promise<void>;
    handleTrackSelect: (track: Track) => void;
};

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

const PlaybackProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<Track>({
        id: "track1",
        title: "Counting Sheeps",
        artist: "sanrio ltd",
        image: LOFI1,
        progress: 0.25,
        playing: false,
        source: SAMPLE_AUDIO,
    });
    
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // --- Audio Session Setup (Unchanged) ---
    useEffect(() => {
        const configureAudio = async () => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true, 
                shouldDuckAndroid: true,
                staysActiveInBackground: true, 
            }).catch(error => console.error('Error setting audio mode:', error));
        };
        configureAudio();
        
        return sound
            ? () => { sound.unloadAsync(); }
            : undefined;
    }, [sound]); 

    // --- Core Audio Logic (Wrapped in useCallback) ---
    const loadAndPlayTrack = useCallback(async (track: Track) => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
        
        try {
            const { sound: newSound } = await Audio.Sound.createAsync(
                track.source, 
                { shouldPlay: true, isLooping: true }
            );
            setSound(newSound);
            setCurrentTrack({ ...track, playing: true, id: track.id });
        } catch (error) {
            console.error('Error loading audio:', error);
            setCurrentTrack({ ...track, playing: false, id: track.id });
        }
    }, [sound]); 
    
    const togglePlay = useCallback(async () => {
        if (!sound) {
            return loadAndPlayTrack(currentTrack);
        }

        if (currentTrack.playing) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setCurrentTrack(t => ({ ...t, playing: !t.playing }));
    }, [sound, currentTrack.playing, currentTrack]); 
    
    const handleTrackSelect = useCallback((track: Track) => {
        if (track.id !== currentTrack.id || !currentTrack.playing) {
            loadAndPlayTrack(track);
        } else {
            togglePlay();
        }
    }, [currentTrack.id, currentTrack.playing, loadAndPlayTrack, togglePlay]);

    return (
        <PlaybackContext.Provider value={{ currentTrack, togglePlay, handleTrackSelect }}>
            {children}
        </PlaybackContext.Provider>
    );
};

// Hook to use the playback context easily
const usePlayback = () => {
    const context = useContext(PlaybackContext);
    if (!context) {
        throw new Error('usePlayback must be used within a PlaybackProvider');
    }
    return context;
};
// ************************************************************
// 🎧 2. COMPONENTS (UPDATED TO USE CONTEXT AND NEW NAV)
// ************************************************************

// --- CustomHeader and other utility components remain unchanged ---
const CustomHeader = () => (
    <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.profileIcon}>
            <Image 
                source={AVATAR} 
                style={styles.avatar} 
                resizeMode="cover" 
            />
        </View>
    </View>
);

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

// --- Custom Pixel Dialog (Placeholder) ---
// Assuming PixelDialog is a separate component for the bear popup
const PixelDialog = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    if (!visible) return null;
    return (
        <View style={styles.dialogOverlay}>
            <View style={styles.dialogContent}>
                <Text style={styles.dialogText}>Pixel Dialog Placeholder</Text>
                <TouchableOpacity onPress={onClose} style={styles.dialogButton}>
                    <Text style={styles.dialogButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


// --- HOME SCREEN (Now uses usePlayback hook) ---
function HomeScreen({ navigation }: any) {
    const { currentTrack, togglePlay, handleTrackSelect } = usePlayback(); 
    const [showDialog, setShowDialog] = useState(false); // State for the new bear button dialog

    const [fontsLoaded] = useFonts({
        "Jersey20-Regular": require("../../assets/fonts/Jersey20-Regular.ttf"),
        "Jersey15": require("@/assets/fonts/Jersey15-Regular.ttf"),
        "PressStart2P": require("@/assets/fonts/PressStart2P-Regular.ttf"), 
    });
    
    if (!fontsLoaded) return <View style={styles.container} />;
    
    const openDetail = (track: Track) => navigation.navigate("PlayerDetail", { track });

    const renderTrackItem = ({ item }: { item: Track }) => (
        <TouchableOpacity onPress={() => handleTrackSelect(item)} style={styles.listItem}> 
            <Image source={item.image} style={styles.thumbSmall} resizeMode="cover" />
            <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.artist}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader />
            <SearchBar />
            <FilterChips />

            {/* Added paddingBottom to the ScrollView to account for both mini-player and bottom nav */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 180 }}> 
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

                {/* Other sections unchanged... */}
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

            {/* MINI PLAYER: PUSHED UP to clear the bottom nav bar */}
            <TouchableOpacity
                style={styles.miniPlayer} // Removed local bottom: 60, using style sheet
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

            {/* 🔄 NEW BOTTOM NAVIGATION */}
            <View style={styles.bottomNav}>
                {/* Mapping Expo Router paths to React Navigation (Home is current screen) 
                Note: 'furni-home/homesc' and 'leaderboard/lead' are mapped to existing stack screens
                */}
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
                    <Image source={HOME_ICON} style={styles.navImage} />
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.navItem} onPress={() => setShowDialog(true)}>
                    <Image source={BEAR_ICON} style={styles.navImage} />
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PlayerDetail')}>
                    <Image source={TROPHY_ICON} style={styles.navImage} />
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.navItem}>
                    <Image source={SETTINGS_ICON} style={styles.navImage} />
                </TouchableOpacity>
            </View>

            <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
        </SafeAreaView>
    );
}

// --- PLAYER DETAIL SCREEN (FIXED FOR SYNC) ---
function PlayerDetail({ navigation }: any) {
    const { currentTrack, togglePlay } = usePlayback();
    const [showDialog, setShowDialog] = useState(false); 
    
    const [progress, setProgress] = useState(currentTrack.progress); 

    const [fontsLoaded] = useFonts({
        "Jersey20-Regular": require("../../assets/fonts/Jersey20-Regular.ttf"),
        "Jersey15": require("@/assets/fonts/Jersey15-Regular.ttf"),
        "PressStart2P": require("@/assets/fonts/PressStart2P-Regular.ttf"), 
    });
    
    useEffect(() => {
        setProgress(currentTrack.progress);
    }, [currentTrack.id, currentTrack.progress]);

    if (!fontsLoaded) return <View style={styles.container} />;
    
    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader />
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
                {/* Top Down Button */}
                <TouchableOpacity
                    style={styles.downButton}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={DOWN} style={styles.downIcon} />
                </TouchableOpacity>

                {/* Display track details from GLOBAL state for consistency */}
                <Image source={currentTrack.image} style={styles.largeArt} resizeMode="cover" /> 
                <Text style={styles.detailTitle}>{currentTrack.title}</Text>
                <Text style={styles.detailArtist}>{currentTrack.artist}</Text>

                {/* Slider (Still relies on local progress state) */}
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
                    {/* SYNCHRONIZED */}
                    <TouchableOpacity onPress={togglePlay}> 
                        <Image 
                            source={currentTrack.playing ? PAUSE : PLAY} 
                            style={styles.playIcon} 
                        />
                    </TouchableOpacity>
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

            {/* 🔄 NEW BOTTOM NAVIGATION */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
                    <Image source={HOME_ICON} style={styles.navImage} />
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.navItem} onPress={() => setShowDialog(true)}>
                    <Image source={BEAR_ICON} style={styles.navImage} />
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('PlayerDetail')}>
                    <Image source={TROPHY_ICON} style={styles.navImage} />
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.navItem}>
                    <Image source={SETTINGS_ICON} style={styles.navImage} />
                </TouchableOpacity>
            </View>

            <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
        </SafeAreaView>
    );
}

// ************************************************************
// 🌐 3. STACK WRAPPER
// ************************************************************
const Stack = createStackNavigator();
export default function JourneyStack() {
    return (
        <PlaybackProvider> 
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="PlayerDetail" component={PlayerDetail} />
            </Stack.Navigator>
        </PlaybackProvider>
    );
}

// --- STYLES (UPDATED for new Bottom Nav and Mini-Player positioning) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#DFF6F9" },
    
    // Dialog styles (Placeholder)
    dialogOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 50 },
    dialogContent: { padding: 20, backgroundColor: 'white', borderRadius: 10, width: '80%', alignItems: 'center' },
    dialogText: { fontSize: 18, marginBottom: 20 },
    dialogButton: { marginTop: 10, padding: 10, backgroundColor: '#BEEAF0', borderRadius: 5 },
    dialogButtonText: { color: '#2E6F79' },

    // --- EDITED HEADER STYLES ---
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        backgroundColor: '#FFF5F5', 
        marginTop: 0 
    },
    dateText: { 
        color: '#000', 
        fontSize: 12, 
        fontWeight: '600', 
        fontFamily: 'PressStart2P-Regular' // Corrected font name based on other samples
    },
    profileIcon: { 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: '#fff', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    avatar: { 
        width: 28, 
        height: 28, 
        borderRadius: 14, 
        resizeMode: "cover"
    },

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

    // 💡 MINI PLAYER STYLE ADJUSTED: Pushed up by calculating the bottom nav height (~78px) + -30 marginBottom
    // 78 (nav height) + 64 (miniplayer height) + 15 (padding) = ~157px total space needed
    // Setting bottom: 100 will move it up past the nav bar.
    miniPlayer: { 
        position: "absolute", 
        width: "100%", 
        height: 64, 
        backgroundColor: "#a4d1d2ff", 
        borderRadius: 0, 
        padding: 8, 
        flexDirection: "row", 
        alignItems: "center", 
        elevation: 8, 
        zIndex: 20, 
        bottom: 80, // <-- PUSHED UP
    },
    miniThumb: { width: 48, height: 48, borderRadius: 6 },
    miniTitle: { fontWeight: "700", fontFamily: "Jersey20-Regular" },
    miniArtist: { fontSize: 12, color: "#333", fontFamily: "Jersey20-Regular" },
    playButton: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },

    // 💡 NEW BOTTOM NAVIGATION STYLES (FROM USER SNIPPET)
    bottomNav: { 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        paddingVertical: 15, 
        paddingHorizontal: 20, 
        justifyContent: 'space-around', 
        borderTopWidth: 1, 
        borderTopColor: '#E0E0E0', 
        marginBottom: 2, // Retaining the negative margin as requested
        width: '100%', 
        position: 'absolute', 
        bottom: 0,
        zIndex: 10 
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