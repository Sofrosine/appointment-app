import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function BookingHistoryScreen() {
  const bookingHistoryData = [
    { id: 1, serviceName: "Education", date: "2023-08-01" },
    { id: 2, serviceName: "Health", date: "2023-08-05" },
    { id: 3, serviceName: "Sports", date: "2023-08-10" },
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header_text}>My Bookings</Text>
        <View style={styles.historyContainer}>
          {bookingHistoryData.map((booking) => (
            <View key={booking.id} style={styles.bookingItem}>
              <Text>{booking.serviceName}</Text>
              <Text>{booking.date}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 48,
  },
  header_text: {
    marginVertical: 16,
    fontSize: 30,
    fontFamily: "Mulish_500Medium",
  },
  historyContainer: {
    marginHorizontal: 24,
  },
  historyTitle: {
    fontSize: 20,
    fontFamily: "Mulish_700Bold",
    marginBottom: 16,
  },
  bookingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
