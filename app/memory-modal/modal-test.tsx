import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import PixelDialog from "./popout"; // adjust path

export default function ModalTestScreen() {
  // define the visibility state
  const [showDialog, setShowDialog] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Chat Modal" onPress={() => setShowDialog(true)} />

      {/* Chat modal */}
      <PixelDialog
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        messages={[
          { id: "1", text: "Hello, AI!", sender: "me" },
          { id: "2", text: "Hello! How can I help you today?", sender: "Memory" },
          { id: "3", text: "Tell me a joke.", sender: "me" },
          { id: "4", text: "Why don’t skeletons fight each other? They don’t have the guts.", sender: "Memory" },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
