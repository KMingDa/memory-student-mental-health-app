import * as Font from "expo-font";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { generateAPIUrl } from "@/utils/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";

export default function PixelDialog({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  // ✅ Setup LLM hook
  const { messages, sendMessage, error } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("../api/chat"),
    }),
    onError: (err) => console.error(err, "ERROR"),
  });

  // ✅ Convert LLM messages into safe strings for UI
  const formattedMessages = messages.map((m) => ({
    id: m.id,
    text: String(
      m.parts
        .map((p) => (p.type === "text" ? p.text : ""))
        .filter(Boolean)
        .join("")
    ),
    sender: m.role === "user" ? "me" : "Memory",
  }));

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFont();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [formattedMessages]);

  const handleSend = () => {
    if (inputText.trim() === "") return;
    sendMessage({ text: inputText.trim() });
    setInputText("");
  };

  if (!fontsLoaded) return null;
  if (error) return <Text style={{ color: "red" }}>{String(error.message)}</Text>;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <View style={styles.dialogBox}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.nameSection}>
                <View style={styles.onlineDot} />
                <Text style={styles.nameText}>'Memory' is online!</Text>
              </View>
              <Pressable onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.divider} />

            {/* Chat Area */}
            <ScrollView style={styles.chatArea} ref={scrollRef}>
              {formattedMessages.map((msg, index) => {
                const showAvatar =
                  msg.sender === "Memory" &&
                  (index === 0 || formattedMessages[index - 1].sender !== "Memory");

                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageRow,
                      msg.sender === "me" ? styles.myRow : styles.llmRow,
                    ]}
                  >
                    {showAvatar && (
                      <Image
                        source={require("../../assets/images/alice.png")}
                        style={styles.avatar}
                      />
                    )}

                    <View
                      style={[
                        styles.bubble,
                        msg.sender === "me" ? styles.myBubble : styles.llmBubble,
                      ]}
                    >
                      <Text style={styles.text}>{msg.text}</Text>
                    </View>

                    {msg.sender === "me" && (
                      <Image
                        source={require("../../assets/images/expavatar.png")}
                        style={styles.avatar}
                      />
                    )}
                  </View>
                );
              })}
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#555"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
              />
              <Pressable style={styles.sendButton} onPress={handleSend}>
                <Image
                  source={require("../../assets/images/send.png")}
                  style={styles.sendIcon}
                />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoid: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogBox: {
    width: "85%",
    height: "70%",
    backgroundColor: "#FDCACAED",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F7B8B8",
  },
  nameSection: { flexDirection: "row", alignItems: "center" },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
    marginRight: 6,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "SpaceMono",
    color: "#000",
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "SpaceMono",
  },
  divider: { height: 1, backgroundColor: "#fff" },
  chatArea: { flex: 1, padding: 10 },
  messageRow: { flexDirection: "row", marginVertical: 5, alignItems: "center" },
  myRow: { justifyContent: "flex-end" },
  llmRow: { justifyContent: "flex-start" },
  bubble: { padding: 10, borderRadius: 6, maxWidth: "70%" },
  myBubble: { backgroundColor: "#F4FECD" },
  llmBubble: { backgroundColor: "#f0f0f0" },
  text: { fontSize: 14, fontFamily: "SpaceMono", color: "#000" },
  avatar: { width: 35, height: 35, borderRadius: 4, marginHorizontal: 6 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: "#FBDDDD",
    position: "relative",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FCE8E8",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "SpaceMono",
    fontWeight: "bold",
    paddingRight: 40,
  },
  sendButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  sendIcon: { width: 24, height: 24, resizeMode: "contain" },
});
