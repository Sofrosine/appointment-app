import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import styles from "./Button.style";
import { FC } from "react";

interface Props {
  onPress: () => void;
  loading?: boolean;
  text: string;
  theme?: "primary" | "secondary";
}

export default function Button({
  onPress,
  loading,
  text,
  theme = "primary",
}: Props) {
  return (
    <TouchableOpacity
      style={styles[theme].container}
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
