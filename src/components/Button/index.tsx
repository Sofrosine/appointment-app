import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import styles from "./Button.style";
import { FC } from "react";

interface Props {
  onPress: () => void;
  loading?: boolean;
  text: string;
  theme?: "primary" | "secondary";
  style?: ViewStyle;
}

export default function Button({
  onPress,
  loading,
  text,
  theme = "primary",
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles[theme].container, style]}
      onPress={() => {
        if (!loading) {
          onPress && onPress();
        }
      }}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator style={styles[theme].activity_icon} color="white" />
      ) : (
        <Text style={styles[theme].text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}
