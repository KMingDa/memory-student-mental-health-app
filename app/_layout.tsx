import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#1e1e1e" }}>
        <StatusBar style="auto" backgroundColor="#1e1e1e" />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </>
  );
}
