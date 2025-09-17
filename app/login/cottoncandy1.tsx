//test
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
    Button,
    ImageBackground,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

const mainBg = require("../../assets/images/cottoncandylogin.png");

// Define navigation type
type RootStackParamList = {
  CottonCandy: undefined;
  Username: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "CottonCandy">;

export default function CottonCandyScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: you can add authentication logic here
    navigation.navigate("Username");
  };

  return (
    <ImageBackground
      source={mainBg}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Log In" onPress={handleLogin} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  overlay: {
    padding: 24,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
