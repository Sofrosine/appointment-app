import React, { FC } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../styles/Theme";

interface Props extends TextInputProps {}

const InputBar: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={{ fontSize: 14, fontFamily: "Mulish_500Medium" }}
        placeholderTextColor={colors.color_gray}
      />
    </View>
  );
};

export default InputBar;

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
