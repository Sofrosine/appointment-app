import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import styles from "./Button.style";
import { FC } from "react";
import { colors } from "../../styles/Theme";

interface Props {
  onPress: () => void;
  loading?: boolean;
  text: string;
  theme?: "primary" | "secondary";
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({
  onPress,
  loading,
  text,
  theme = "primary",
  style,
  disabled,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles[theme].container, disabled && {backgroundColor: colors.color_gray}, style]}
      onPress={() => {
        if (!loading || !disabled) {
          onPress && onPress();
        }
      }}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator style={styles[theme].activity_icon} color="white" />
      ) : (
        <Text style={styles[theme].text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}
