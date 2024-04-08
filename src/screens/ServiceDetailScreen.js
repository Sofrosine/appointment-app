import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Share,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button/Button";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, sizes } from "../styles/Theme";
import userImages from "../utils/UserImageUtils";

export default function ServiceDetailScreen({ route, navigation }) {
  const { item } = route.params || {};

  const shareContent = async () => {
    try {
      const result = await Share.share({
        message: "Take a look at this...",
        title: "App Sharing",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //NAVIGATION
  const goToBookingScreen = (item) => {
    navigation.navigate("ServiceBookingScreen", { item });
  };

  return (
    <View style={styles.out_container}>
      <ScrollView style={styles.container}>
        <View style={styles.share_container}>
          <TouchableOpacity onPress={shareContent}>
            <Feather name="share" size={24} color={colors.color_primary} />
          </TouchableOpacity>
        </View>
        {/* Header */}
        <View style={styles.header_container}>
          <Image
            style={styles.image_container}
            source={{ uri: item?.image_url }}
          />
          <View>
            <View style={styles.title_container}>
              <Text style={styles.title}>
                {item?.first_name} {item?.last_name}
              </Text>
              <Text style={styles.about}>{item?.expert_area} Expert</Text>
            </View>
            {/* <View style={styles.location_container}>
              <Ionicons
                name="ios-location-outline"
                size={18}
                color={colors.color_primary}
              />
              <Text style={styles.location}>{item?.district}</Text>
            </View> */}
          </View>
        </View>
        {/* Body */}
        <View style={styles.body_container}>
          <View style={styles.about_container}>
            <Text style={styles.about}>About</Text>
            <View style={styles.skills_container}>
              {item?.skills.map((skill, index) => (
                <View key={index} style={styles.chip_container}>
                  <Text style={styles.chips}>{skill}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.desc}>{item?.about}</Text>
          </View>
        </View>

        <View style={styles.detail_container}>
          <View style={styles.detail}>
            <Text style={styles.detail_text}>{item?.yoe}+</Text>
            <Text style={styles.detail_text}>Experience</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detail_text}>{item?.appointments}</Text>
            <Text style={styles.detail_text}>Completed Appointments</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.button_container}>
        <Button
          text={"Book Appointment"}
          onPress={() => goToBookingScreen(item)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  out_container: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  share_container: {
    flex: 1,
    marginTop: 48,
    marginHorizontal: 4,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  header_container: {
    flexDirection: "row",
    backgroundColor: colors.color_white,
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
  },
  body_container: {
    flexDirection: "row",
    backgroundColor: colors.color_white,
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
    justifyContent: "center",
  },
  image_container: {
    marginRight: 16,
    borderRadius: 50,
    overflow: "hidden",
    width: 100,
    height: 100,
  },
  title_container: {
    flex: 1,
  },
  location_container: { flexDirection: "row", paddingVertical: 8 },
  about_container: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  button_container: {
    flexDirection: "row",
    marginBottom: 126,
    marginHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Mulish_500Medium",
  },
  about: {
    fontSize: 20,
    fontFamily: "Mulish_300Light",
    textTransform: "capitalize",
  },
  desc: {
    fontSize: 14,
    fontFamily: "Mulish_300Light",
  },
  detail_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "space-between",
  },
  skills_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    flexWrap: "wrap",
  },
  detail: {
    flex: 1,
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 12,
    height: sizes.width / 3,
    justifyContent: "center",
    backgroundColor: colors.color_white,
  },
  detail_text: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Mulish_600SemiBold",
    color: colors.color_primary,
  },
  chips: {
    alignSelf: "flex-start",
    fontFamily: "Mulish_300Light",
    color: colors.color_white,
  },
  chip_container: {
    borderRadius: 20,
    backgroundColor: colors.color_primary,
    padding: 12,
    margin: 4,
  },
  location: {
    fontSize: 16,
    fontFamily: "Mulish_300Light",
    flex: 1,
    color: colors.color_primary,
    justifyContent: "center",
  },
});
