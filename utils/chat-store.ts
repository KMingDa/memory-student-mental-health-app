import AsyncStorage from "@react-native-async-storage/async-storage";

export type ChatMessage = {
  id: string;
  sender: "me" | "Memory";
  text: string;
  timestamp: number;
};

export async function loadChat(chatId: string): Promise<ChatMessage[]> {
  try {
    const stored = await AsyncStorage.getItem(chatId);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Load chat error:", err);
    return [];
  }
}

export async function saveChat(chatId: string, messages: ChatMessage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(chatId, JSON.stringify(messages));
  } catch (err) {
    console.error("Save chat error:", err);
  }
}

export async function clearChat(chatId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(chatId);
  } catch (err) {
    console.error("Clear chat error:", err);
  }
}

export const chatStore = {
  load: loadChat,
  save: saveChat,
  clear: clearChat,
};
