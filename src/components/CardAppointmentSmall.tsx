import React from "react";
import { colors } from "../styles/Theme";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function CardAppointmentSmall({
  appointment,
  serviceInfo,
  onPress,
}) {
  const {
    type,
    booked_date: bookedDate,
    booked_time: bookedTime,
  } = appointment;

  const fullName = serviceInfo?.first_name + " " + serviceInfo?.last_name;

  const formattedDate = new Date(bookedDate);
  const day = formattedDate?.getDate();
  const month = formattedDate?.toLocaleString("default", { month: "short" });

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.info_container}>
          <Text style={styles.appType}>
            {type?.name}, {fullName}
          </Text>
          <Text style={styles.time}>
            {bookedTime}, {day} {month}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 20,
    paddingHorizontal: 24,
    marginVertical: 8,
    paddingVertical: 8,
    backgroundColor: colors.color_white,
    shadowColor: colors.color_gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 6,
  },

  info_container: {
    flex: 1,
    justifyContent: "center",
  },

  appType: {
    fontFamily: "Mulish_500Medium",
    fontSize: 14,
    padding: 4,
    textTransform: "capitalize",
  },
  time: {
    fontFamily: "Mulish_500Medium",
    fontSize: 14,
    padding: 4,
    color: colors.color_gray,
  },
});
