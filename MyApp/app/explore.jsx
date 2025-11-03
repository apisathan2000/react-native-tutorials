import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function exploreD() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    backgroundColor: "white",
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
