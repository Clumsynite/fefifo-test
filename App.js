import React from "react";
import { StyleSheet, View } from "react-native";
import Screen from "./Screen";
import "react-native-get-random-values";

export default function App() {
  return (
    <View style={styles.container}>
      <Screen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
