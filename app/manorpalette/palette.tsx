// App.js
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function App() {
  const router = useRouter();

  // Load the custom font
  const [fontsLoaded] = useFonts({
    Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
  });

  if (!fontsLoaded) return null; // Wait until font is loaded

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Top Bar --- */}
      <View style={styles.topBar}>
        <Text style={styles.date}>28 AUG 2025</Text>
        <Image
          source={require("../../assets/images/misavatar.png")}
          style={styles.avatar}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Title */}
        <Text style={styles.title}>MANOR PALETTE</Text>
        <Text style={styles.subtitle}>Select your game and have fun!</Text>

        {/* --- Book-ify! Card --- */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/bookify/bookify")}
        >
          <Image
            source={require("../../assets/images/bookifys.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Book-ify!</Text>
            <Text style={styles.cardDesc}>
              A simple, aesthetically pleasing bookshelf arranging minigame
              where you can decorate as you please. No one is here to tell you
              what’s right and what’s wrong.
            </Text>
          </View>
        </TouchableOpacity>

        {/* --- Whack-a-Mole Card --- */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/whackgame/app")}
        >
          <Image
            source={require("../../assets/images/whackamole.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>WHACK A MOLE</Text>
            <Text style={styles.cardDesc}>
              Stressed? This is a simple, fun minigame where you can de-stress
              in the most classic way ever. Beware not to let the target leave
              or else it’s game over!
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* --- Bottom Menu --- */}
      <View style={styles.bottomMenu}>
        <Image source={require("../../assets/images/home.png")} style={styles.icon} />
        <Image source={require("../../assets/images/bear.png")} style={styles.icon} />
        <Image source={require("../../assets/images/trophy.png")} style={styles.icon} />
        <Image source={require("../../assets/images/settings.png")} style={styles.icon} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE6FE",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255,182,193,0.3)",
    borderRadius: 10,
    margin: 1,
    marginTop: -10,
  },
  date: {
    fontSize: 14,
    fontFamily: "Jersey20",
    color: "#000",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scroll: {
    alignItems: "center",
    paddingBottom: 100,
    paddingTop: 30,
  },
  title: {
    fontSize: 50,
    fontFamily: "Jersey20",
    color: "#C02020",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
  },
  textContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 30,
    fontFamily: "Jersey20",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "justify",
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    bottom: 5,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ffffffff",
    backgroundColor: "#fff",
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});