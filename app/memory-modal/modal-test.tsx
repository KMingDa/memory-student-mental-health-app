import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import PixelDialog from "./popout"; // adjust path if needed

export default function ModalTestScreen() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Chat Modal" onPress={() => setShowDialog(true)} />

      {/* LLM Chat modal */}
      <PixelDialog
        visible={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
