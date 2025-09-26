import * as Font from "expo-font";
import { useEffect, useState } from "react";
import {
    Image,
    ImageSourcePropType,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

type DailyCheckinProps = {
  visible: boolean;
  onClose: () => void;
  name: string;
  checkedDays: number;
};

type RewardItem = {
  day: number;
  image: ImageSourcePropType;
  color: string;
};

export default function DailyCheckinModal({
  visible,
  onClose,
  name,
  checkedDays
}: DailyCheckinProps) {
  const [checked, setChecked] = useState<boolean[]>(Array(7).fill(false));
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const checkinData: RewardItem[] = [
    { day: 1, image: require("../../assets/images/currency2.png"), color: "#F4A261" },
    { day: 2, image: require("../../assets/images/cake.png"), color: "#FFD1DC" },
    { day: 3, image: require("../../assets/images/question.png"), color: "#FFE066" },
    { day: 4, image: require("../../assets/images/question.png"), color: "#A2D2FF" },
    { day: 5, image: require("../../assets/images/currency2.png"), color: "#B5E48C" },
    { day: 6, image: require("../../assets/images/question.png"), color: "#FFB5A7" },
    { day: 7, image: require("../../assets/images/chocolate.png"), color: "#FFE0AC" },
  ];

  const handlePress = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = true;
    setChecked(newChecked);
  };

  // Load fonts
  useEffect(() => {
    Font.loadAsync({
      Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        {/* 标题 */}
        <View style={styles.titleBox}>
          <Text style={[styles.title, { fontFamily: "Jersey20" }]}>DAILY CHECK IN</Text>
        </View>

        {/* 主框 */}
        <View style={styles.container}>
          {/* Message */}
          <View style={styles.messageBox}>
            <Text style={[styles.message, { fontFamily: "Jersey20" }]}>
              Good day, {name}!
            </Text>
            <Text style={[styles.message, { fontFamily: "Jersey20" }]}>
              You've checked in for {checkedDays} day(s).
            </Text>
            <Text style={[styles.message, { fontFamily: "Jersey20" }]}>
              Keep it up!
            </Text>
          </View>

          <View style={styles.separator} />

          {/* Day 1–6 */}
          <View style={styles.grid}>
            {checkinData.slice(0, 6).map((item, index) => (
              <TouchableOpacity
                key={item.day}
                style={[styles.rewardBox, { backgroundColor: item.color }]}
                onPress={() => handlePress(index)}
              >
                <Image source={item.image} style={styles.rewardImage} />
                {checked[index] && (
                  <Image
                    source={require("../../assets/images/check.png")} // 你的勾选 PNG
                    style={styles.checkImage}
                  />
                )}
                <Text style={[styles.dayText, { fontFamily: "Jersey20" }]}>Day {item.day}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Day 7 */}
          <View style={styles.lastDayContainer}>
            <TouchableOpacity
                style={[styles.rewardBox, { 
                    backgroundColor: checkinData[6].color, 
                    width: "92%",
                    height: 90,
                    aspectRatio: undefined
                }]}
                onPress={() => handlePress(6)}
            >
                <Image source={checkinData[6].image} style={styles.rewardImage} />
                {checked[6] && (
                  <Image
                    source={require("../../assets/images/check.png")}
                    style={styles.checkImage}
                  />
                )}
                <Text style={[styles.dayText, { fontFamily: "Jersey20" }]}>Day 7</Text>
            </TouchableOpacity>
          </View>

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
    top: 165,
    left: "5%",
    width: "70%",
    height: 60,
    backgroundColor: "#A45959",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-1deg" }],
    zIndex: 0
  },
  title: {
    fontSize: 36,
    fontFamily: "Jersey20",
    fontWeight: "bold",
    color: "#fff"
  },
  container: {
    width: "90%",
    backgroundColor: "#C48282",
    borderRadius: 10,
    padding: 0,
    alignItems: "center",
    marginTop: 90,
    borderWidth: 2,
    borderColor: "#fff"
  },
  messageBox: {
    margin: 10,
    width: "100%",
    padding: 10
  },
  message: {
    fontSize: 22,
    color: "#000",
    textAlign: "center",
    marginBottom: 2
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10
  },
  rewardBox: {
    width: "28%",
    height: 120,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  rewardImage: {
    width: 50,
    height: 50,
    marginVertical: 10,
    resizeMode: "contain"
  },
  checkImage: {
    position: "absolute",
    width: 60,
    height: 60,
    resizeMode: "contain",
    top: '30%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }]
  },
  dayText: {
    fontSize: 18,
    fontWeight: "600"
  },
  lastDayContainer: {
    marginTop: 2,
    width: "100%",
    alignItems: "center"
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
