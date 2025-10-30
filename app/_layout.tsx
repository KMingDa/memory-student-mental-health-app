import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { CurrencyProvider } from "./context/CurrencyContext";

export default function RootLayout() {
  return (
    <>
      <CurrencyProvider>
        <View style={{ flex: 1, backgroundColor: "#1e1e1e" }}>
          <StatusBar style="auto" backgroundColor="#1e1e1e" />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </CurrencyProvider>
    </>
  );
}
