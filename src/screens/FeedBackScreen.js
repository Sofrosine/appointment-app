import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FeedBackScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Provide Feedback</Text>
      <InputBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 48,
  },
  header_text: {
    marginHorizontal: 24,
    marginVertical: 32,
    fontSize: 30,
    fontFamily: "Mulish_500Medium",
  },
  text: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 16,
    fontFamily: "Mulish_500Medium",
  },
});
