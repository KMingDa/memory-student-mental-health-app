import * as Font from "expo-font";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useCurrency } from "../context/CurrencyContext";

type WeeklyQuestProps = {
  visible: boolean;
  onClose: () => void;
  name: string;
  completedQuests: number;
};

type QuestItem = {
  id: number;
  description: string;
  reward: string;
  image: ImageSourcePropType;
};

export default function WeeklyQuestModal({
  visible,
  onClose,
  name,
  completedQuests
}: WeeklyQuestProps) {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [questOrder, setQuestOrder] = useState<QuestItem[]>([]);
  const { addCurrency } = useCurrency(); //currency

  const scrollRef = useRef<ScrollView>(null);

  const questData: QuestItem[] = [
    { id: 1, description: "Check In", reward: "+50", image: require("../../assets/images/currency2.png") },
    { id: 2, description: "Log an entry in 'Journal'", reward: "+100", image: require("../../assets/images/currency2.png") },
    { id: 3, description: "Play Whack-A-Mole!", reward: "+150", image: require("../../assets/images/currency2.png") },
    { id: 4, description: "Spend 5 minutes with Memory", reward: "+300", image: require("../../assets/images/currency2.png") },
    { id: 5, description: "Try out one of the TOP Exercise Regime", reward: "+200", image: require("../../assets/images/currency2.png") },
    { id: 6, description: "Read a news from Daily News for 3 minutes", reward: "+200", image: require("../../assets/images/currency2.png") },
  ];

  useEffect(() => {
    Font.loadAsync({
      Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
    }).then(() => setFontsLoaded(true));

    setQuestOrder(questData);
  }, []);

  const handlePress = async (questId: number) => {
    if (checkedIds.includes(questId)) return;

    setCheckedIds(prev => [...prev, questId]);

    // Move completed quest to bottom
    const completedQuest = questOrder.find(q => q.id === questId)!;
    const remaining = questOrder.filter(q => q.id !== questId);
    setQuestOrder([...remaining, completedQuest]);

    // 💰 Add reward to global currency
    const reward = parseInt(completedQuest.reward.replace("+", ""), 10);
    await addCurrency(reward);

    // Scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }; //to update the currency immediately upon checking a quest


  if (!fontsLoaded) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        {/* 顶部标题 */}
        <View style={styles.titleBox}>
          <Text style={[styles.title, { fontFamily: "Jersey20" }]}>Weekly Quest</Text>
        </View>

        {/* 主框 */}
        <View style={styles.container}>
          {/* Message */}
          <View style={styles.messageBox}>
            <Text style={[styles.message, { fontFamily: "Jersey20" }]}>
              Good day, {name}!
            </Text>
            <Text style={[styles.message, { fontFamily: "Jersey20" }]}>
              You’ve completed {completedQuests} quests as of now.
            </Text>
            <Text style={[styles.message, { fontFamily: "Jersey20" }]}>
              Keep it up!
            </Text>
          </View>

          <View style={styles.separator} />

          {/* Quest bars */}
          <ScrollView ref={scrollRef} style={styles.questContainer}>
            {questOrder.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.questBox,
                  { backgroundColor: checkedIds.includes(item.id) ? "#946FA3" : "#E8C6F596" }
                ]}
                onPress={() => handlePress(item.id)}
              >
                <View style={styles.questTextContainer}>
                  <Text
                    style={[
                      styles.questText,
                      {
                        fontFamily: "Jersey20",
                        textDecorationLine: checkedIds.includes(item.id) ? "line-through" : "none"
                      }
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
                <View style={styles.rewardBox}>
                  <Text
                    style={[
                      styles.rewardText,
                      {
                        fontFamily: "Jersey20",
                        textDecorationLine: checkedIds.includes(item.id) ? "line-through" : "none"
                      }
                    ]}
                  >
                    {item.reward}
                  </Text>
                  <Image source={item.image} style={styles.rewardImage} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Close */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  titleBox: {
    position: "absolute",
    padding: 5,
    top: 160,
    left: "5%",
    width: "70%",
    height: 60,
    backgroundColor: "#7DBBD1",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-1deg" }],
    zIndex: 0
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff"
  },
  container: {
    width: "90%",
    backgroundColor: "#AFA5E6",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 170,
    borderWidth: 2,
    borderColor: "#fff",
    maxHeight: "70%"
  },
  messageBox: {
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 10
  },
  message: {
    fontSize: 22,
    color: "#000",
    textAlign: "center",
    marginBottom: 4
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    marginVertical: 8
  },
  questContainer: {
    width: "100%",
    paddingBottom: 10
  },
  questBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#E8C6F596",
  },
  questTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  questText: {
    fontSize: 22,
    color: "#000",
    flexWrap: "wrap"
  },
  rewardBox: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0
  },
  rewardText: {
    fontSize: 22,
    marginRight: 5
  },
  rewardImage: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10
  },
  close: {
    fontSize: 20,
    color: "#000"
  }
});
