import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../styles/Theme";

export default function InputBar(props) {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={{ fontSize: 14, fontFamily: "Mulish_500Medium" }}
        placeholderTextColor={colors.color_gray}
        secureTextEntry={props.isSecure}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderColor: colors.color_light_gray,
    backgroundColor: colors.color_light_gray,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 8,
  },
});
