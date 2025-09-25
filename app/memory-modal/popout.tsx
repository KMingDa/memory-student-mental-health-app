import * as Font from "expo-font";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  InteractionManager,
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

import { ChatMessage, chatStore } from "@/utils/chat-store";
import { generateAPIUrl } from "@/utils/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";

export default function PixelDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [dotCount, setDotCount] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Load fonts
  useEffect(() => {
    Font.loadAsync({
      Jersey20: require("../../assets/fonts/Jersey20-Regular.ttf"),
      SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    }).then(() => setFontsLoaded(true));
  }, []);

  // Load persisted messages
  useEffect(() => {
    chatStore.load("chat_history").then((loaded) => {
      setHistory(loaded);
      setHasLoadedHistory(true);
    });
  }, []);

  // Auto-scroll after history or dotCount changes
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    });
    return () => task.cancel?.();
  }, [history, dotCount]);

  // Auto-scroll when Modal opens
  useEffect(() => {
    if (visible && hasLoadedHistory) {
      const task = InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: false });
        }, 50);
      });
      return () => task.cancel?.();
    }
  }, [visible, hasLoadedHistory]);

  // useChat hook
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("../api/chat"),
    }),
  });

  // Update history on AI message
  useEffect(() => {
    setHistory((prev) => {
      const newHistory = [...prev];
      messages.forEach((msg) => {
        if (msg.role !== "assistant") return;
        const text = msg.parts.map((p: any) => (p.type === "text" ? p.text : "")).join("");
        const existingIndex = newHistory.findIndex((h) => h.id === msg.id);
        if (existingIndex !== -1) newHistory[existingIndex].text = text;
        else newHistory.push({ id: msg.id, sender: "Memory", text, timestamp: Date.now() });
      });
      return newHistory;
    });
  }, [messages]);

  // Typing animation
  useEffect(() => {
    if (status === "submitted") {
      const interval = setInterval(() => setDotCount((prev) => (prev >= 3 ? 1 : prev + 1)), 500);
      return () => clearInterval(interval);
    } else setDotCount(0);
  }, [status]);

  // Save history
  useEffect(() => {
    if (status === "ready" && hasLoadedHistory) chatStore.save("chat_history", history);
  }, [status, history, hasLoadedHistory]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage({ text: inputText.trim() });
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText.trim(),
      timestamp: Date.now(),
    };
    setHistory((prev) => [...prev, newMsg]);
    setInputText("");
  };

  const clearHistory = async () => {
    await chatStore.clear("chat_history");
    setHistory([]);
    setConfirmClear(false);
    setShowDropdown(false);
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
                <Pressable onPress={() => setShowDropdown((prev) => !prev)}>
                  <Text style={[styles.nameText, { fontFamily: "Jersey20" }]}>Memory is online!</Text>
                </Pressable>
              </View>
              <Pressable onPress={onClose}>
                <Image source={require("../../assets/images/cross.png")} style={{ width: 18, height: 18 }} />
              </Pressable>
            </View>
            <View style={styles.divider} />

            {/* Dropdown */}
            {showDropdown && (
              <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                {/* 点击空白区域关闭 dropdown */}
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => setShowDropdown(false)}
                  pointerEvents="box-only"
                />
                <View style={[styles.dropdown, { top: 50 }]}>
                  <Pressable onPress={() => setConfirmClear(true)} style={styles.dropdownItem}>
                    <Text style={[styles.dropdownText, { fontFamily: "SpaceMono" }]}>Clear History</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Chat Area */}
            <ScrollView style={styles.chatArea} ref={scrollRef}>
              {history.map((msg, index) => {
                const showAvatar = msg.sender === "Memory" && (index === 0 || history[index - 1].sender !== "Memory");
                return (
                  <View
                    key={msg.id + index}
                    style={[styles.messageRow, msg.sender === "me" ? styles.myRow : styles.llmRow]}
                  >
                    {showAvatar && <Image source={require("../../assets/images/alice.png")} style={styles.avatar} />}
                    <View style={[styles.bubble, msg.sender === "me" ? styles.myBubble : styles.llmBubble]}>
                      <Text style={styles.text}>{msg.text}</Text>
                    </View>
                    {msg.sender === "me" && <Image source={require("../../assets/images/expavatar.png")} style={styles.avatar} />}
                  </View>
                );
              })}

              {/* Typing indicator */}
              {status === "submitted" && (
                <View style={styles.messageRow}>
                  <Image source={require("../../assets/images/alice.png")} style={styles.avatar} />
                  <View style={[styles.bubble, styles.llmBubble]}>
                    <Text style={styles.text}>{`Typing${".".repeat(dotCount)}`}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.inputBar}>
              <TextInput
                style={[styles.textInput, { fontFamily: "Jersey20" }]}
                placeholder="Type a message..."
                placeholderTextColor="#555"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
                multiline
                textAlignVertical="top"
              />
              <Pressable style={styles.sendButton} onPress={handleSend}>
                <Image source={require("../../assets/images/send.png")} style={styles.sendIcon} />
              </Pressable>
            </View>

            {/* Confirm Clear Modal */}
            {confirmClear && (
              <Modal transparent animationType="fade">
                <View style={styles.confirmOverlay}>
                  <View style={styles.confirmBox}>
                    <Text style={[styles.confirmText, { fontFamily: "SpaceMono" }]}>
                      Are you sure you want to clear the chat history?
                    </Text>
                    <View style={styles.confirmButtons}>
                      <Pressable onPress={clearHistory} style={[styles.confirmButton, { backgroundColor: "green" }]}>
                        <Text style={[styles.confirmButtonText, { color: "#fff" }]}>Yes</Text>
                      </Pressable>
                      <Pressable onPress={() => setConfirmClear(false)} style={[styles.confirmButton, { backgroundColor: "red" }]}>
                        <Text style={styles.confirmButtonText}>No</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  keyboardAvoid: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
  dialogBox: {
    width: "85%",
    height: "70%",
    backgroundColor: "#FDCACAED",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#F7B8B8" },
  nameSection: { flexDirection: "row", alignItems: "center" },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "green", marginRight: 6 },
  nameText: { fontWeight: "bold", fontSize: 20, color: "#000" },
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
  inputBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingVertical: 6, backgroundColor: "#FBDDDD", position: "relative" },
  textInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "#FCE8E8", borderRadius: 10, fontSize: 18, fontWeight: "bold", paddingRight: 40 },
  sendButton: { position: "absolute", right: 10, top: "50%", transform: [{ translateY: -12 }], padding: 4 },
  sendIcon: { width: 24, height: 24, resizeMode: "contain" },

  // Dropdown styles
  dropdown: { position: "absolute", left: 10, backgroundColor: "#fff", borderRadius: 6, padding: 5, zIndex: 1000 },
  dropdownItem: { padding: 10 },
  dropdownText: { fontSize: 14 },

  // Confirm modal styles
  confirmOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  confirmBox: { width: "70%", backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  confirmText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  confirmButtons: { flexDirection: "row", justifyContent: "space-around" },
  confirmButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6, backgroundColor: "#ddd" },
  confirmButtonText: { fontWeight: "bold", textAlign: "center" },
});
