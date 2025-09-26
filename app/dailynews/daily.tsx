import { useFonts } from "expo-font";
import { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Article {
  id: string;
  title?: string;
  body?: string;
  image: any;
}

export default function DailyNews() {
  const [fontsLoaded] = useFonts({
    Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
  });

  const articles: Article[] = [
    {
      id: "Anaxa's Ideology",
      title: "There is More Than One Braincells in Human Brain?",
      body:
        "A research conducted by Prof. Anaxagoras showed that human intelligence may be influenced by the amount of braincells present in a person’s brain...",
      image: require("../../assets/images/zb1.jpg"),
    },
    {
      id: "Vera's New Launch",
      image: require("../../assets/images/newprod.png"),
    },
    {
      id: "Frieren, Stop Stealing My Food!",
      image: require("../../assets/images/berry.png"),
    },
    {
      id: "What's that?",
      title: "FACT OF THE DAY",
      body:
        "Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient tombs that are still edible!",
      image: null,
    },
    {
      id: "Weather Report: Ice Cream Sales Soar",
      image: require("../../assets/images/icecream.png"),
    },
    {
      id: "I got 99 Problems but Exercise Ain't One",
      title: "11 minutes of aerobic Daily lowers diabetes risk",
      body:
        "Studies and research show that adding 11 minutes of exercise to your day could lower your risk of chronic diseases ...",
      image: require("../../assets/images/exercise.jpg"),
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"like" | "neutral" | "dislike" | null>(
    null
  );
  const [comment, setComment] = useState("");

  if (!fontsLoaded) return null;

  const openModal = (articleId: string) => {
    setSelectedArticle(articleId);
    setModalVisible(true);
    setFeedback(null);
    setComment("");
  };

  const submitFeedback = () => {
    console.log("Feedback for article:", selectedArticle);
    console.log("Feedback type:", feedback);
    console.log("Comment:", comment);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />

      {/* Title */}
      <View style={styles.titleWrapper}>
        <Text style={[styles.header, styles.daily]}>DAILY</Text>
        <Text style={[styles.header, styles.news]}>NEWS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Row 1: Research Findings + stacked right column */}
        <View style={styles.row}>
          <View style={[styles.card, { width: 181, height: 313 }]}>
            <TouchableOpacity
              style={styles.leftFeedbackBtn}
              onPress={() => openModal("research")}
            >
              <Text style={styles.feedbackText}>⋮</Text>
            </TouchableOpacity>
            <Image
              source={articles[0].image}
              style={[styles.fullImage, { height: 180 }]}
              resizeMode="cover"
            />
            <View style={styles.textBox}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{articles[0].title}</Text>
                <Text style={styles.body}>
                  {articles[0].body}{" "}
                  <Text style={styles.readMore}>Read more &gt;</Text>
                </Text>
              </ScrollView>
            </View>
          </View>

          <View style={styles.column}>
            <View style={[styles.card, { width: 145, height: 152 }]}>
              <TouchableOpacity
                style={styles.leftFeedbackBtn}
                onPress={() => openModal("newprod")}
              >
                <Text style={styles.feedbackText}>⋮</Text>
              </TouchableOpacity>
              <Image
                source={articles[1].image}
                style={styles.fullImage}
                resizeMode="cover"
              />
            </View>
            <View style={[styles.card, { width: 145, height: 152 }]}>
              <TouchableOpacity
                style={styles.leftFeedbackBtn}
                onPress={() => openModal("berry")}
              >
                <Text style={styles.feedbackText}>⋮</Text>
              </TouchableOpacity>
              <Image
                source={articles[2].image}
                style={styles.fullImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Fact of the Day */}
        <View style={[styles.card, styles.factBox]}>
          <TouchableOpacity
            style={styles.leftFeedbackBtn}
            onPress={() => openModal("fact")}
          >
            <Text style={styles.feedbackText}>⋮</Text>
          </TouchableOpacity>
          <Text style={styles.factTitle}>{articles[3].title}</Text>
          <Text style={styles.factBody}>{articles[3].body}</Text>
        </View>

        {/* Row 2: Ice Cream + Exercise */}
        <View style={[styles.row, { marginTop: 12 }]}>
          <View style={[styles.card, { width: 86, height: 205 }]}>
            <TouchableOpacity
              style={styles.leftFeedbackBtn}
              onPress={() => openModal("icecream")}
            >
              <Text style={styles.feedbackText}>⋮</Text>
            </TouchableOpacity>
            <Image
              source={articles[4].image}
              style={styles.fullImage}
              resizeMode="cover"
            />
          </View>

          <View style={[styles.card, { width: 250, height: 205 }]}>
            <TouchableOpacity
              style={styles.leftFeedbackBtn}
              onPress={() => openModal("exercise")}
            >
              <Text style={styles.feedbackText}>⋮</Text>
            </TouchableOpacity>
            <Image
              source={articles[5].image}
              style={[styles.fullImage, { height: 120 }]}
              resizeMode="cover"
            />
            <View style={styles.textBox}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{articles[5].title}</Text>
                <Text style={styles.body}>
                  {articles[5].body}{" "}
                  <Text style={styles.readMore}>Read more &gt;</Text>
                </Text>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar} />

      {/* Feedback Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Feedback for {selectedArticle}
            </Text>

            <TouchableOpacity onPress={() => setFeedback("like")}>
              <Text style={feedback === "like" ? styles.selected : styles.option}>
                👍 I like it
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFeedback("neutral")}>
              <Text
                style={feedback === "neutral" ? styles.selected : styles.option}
              >
                😐 Neutral
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFeedback("dislike")}>
              <Text
                style={feedback === "dislike" ? styles.selected : styles.option}
              >
                👎 Do not like it
              </Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Additional comments (optional)"
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              multiline
            />

            <TouchableOpacity style={styles.submitBtn} onPress={submitFeedback}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: "#ccc", marginTop: 8 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d9f3ff" },
  topBar: { backgroundColor: "#ffe4ec", height: 28 },
  bottomBar: { backgroundColor: "#ffe4ec", height: 28 },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  header: { fontFamily: "Jersey20", fontSize: 60 },
  daily: { color: "#000", marginRight: 6 },
  news: { color: "#D66878" },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  column: { flexDirection: "column", alignItems: "center" },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "visible",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fullImage: { width: "100%", height: "100%" },
  textBox: { padding: 8, flexShrink: 1 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#333" },
  readMore: { fontWeight: "bold", color: "#D66878" },
  body: { fontSize: 12, color: "#555" },
  factBox: { width: "95%", padding: 16, alignSelf: "center", alignItems: "center" },
  factTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  factBody: { fontSize: 14, textAlign: "center", color: "#444" },
  leftFeedbackBtn: { position: "absolute", top: 8, left: 8, padding: 4, zIndex: 10 },
  feedbackText: { fontSize: 18, color: "#555" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  option: { fontSize: 14, paddingVertical: 6 },
  selected: { fontSize: 14, paddingVertical: 6, color: "#D66878", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginVertical: 12,
    minHeight: 60,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#D66878",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold" },
});
