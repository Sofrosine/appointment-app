import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../styles/Theme";
import { Feather, Ionicons } from "@expo/vector-icons";

//ICONS
const iconPref: any = ({ route }) => {
  return {
    tabBarIcon: ({ color }) => {
      let iconName;

      if (route.name === "Home") {
        iconName = "home";
      } else if (route.name === "Profile") {
        iconName = "user";
      } else if (route.name === "Appointments") {
        iconName = "calendar";
      } else if (route.name === "Search") {
        iconName = "search";
      } else if (route.name === "Doctor") {
        iconName = "briefcase";
      } else if (route.name === "Category") {
        iconName = "grid";
      }
      //returns in each icon
      return <Feather name={iconName} size={30} color={color} />;
    },
    tabBarStyle: {
      ...styles.shadow,
      position: "absolute",
      bottom: 12,
      left: 12,
      right: 12,
      borderRadius: 20,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 0,
    },
    tabBarActiveTintColor: colors.color_primary,
    tabBarInactiveTintColor: colors.color_gray,
    headerShown: false,
    tabBarShowLabel: false,
  };
};

export const customTabButton = ({ children, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ top: -20, justifyContent: "center", alignItems: "center" }}
  >
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 32,
        backgroundColor: colors.color_primary,
        ...styles.shadow,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Feather name="map-pin" size={30} color={colors.color_white} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.color_gray,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default iconPref;
