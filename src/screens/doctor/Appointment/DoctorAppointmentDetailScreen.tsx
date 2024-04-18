import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { app, getAuth } from "../../../../firebaseConfig";
import Button from "../../../components/Button";
import { colors } from "../../../styles/Theme";
import { useAppSelector } from "../../../hooks";
import dayjs from "dayjs";
import { child, get, getDatabase, ref } from "firebase/database";

const auth = getAuth(app);

export default function DoctorAppointmentDetailScreen({ route, navigation }) {
  const { item } = route.params || {};

  const scrollViewRef = useRef(null);

  const [userData, setUserData] = useState(null);

  // Get current date and time
  const currentTime = dayjs();

  // Convert booked date and time to a Day.js object
  const bookedDateTime = dayjs(`${item?.booked_date} ${item?.booked_time}`);

  // Check if the current time is less than the booked date and time
  const isBeforeBookedDateTime = currentTime?.isBefore(bookedDateTime);

  useEffect(() => {
    getUserFromDatabase();
  }, []);
  const getUserFromDatabase = async () => {
    // setLoading(true);
    try {
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, "users/" + item?.user_id));

      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        console.log("No data time list");
      }
    } catch (error) {
      console.error(error);
    } finally {
      //   setLoading(false);
    }
  };

  return (
    <View style={styles.out_container}>
      <ScrollView
        nestedScrollEnabled={true}
        ref={scrollViewRef}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header_container}>
          <Image
            style={styles.image_container}
            source={{ uri: item?.doctor?.image_url }}
          />
          <View>
            <View style={styles.title_container}>
              <Text style={styles.title}>
                {item?.doctor?.first_name} {item?.doctor?.last_name}
              </Text>
              <Text style={styles.about}>
                {item?.doctor?.expert_area?.name} Expert
              </Text>
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

        <View
          style={{
            backgroundColor: colors.color_white,
            paddingHorizontal: 16,
            paddingBottom: 16,
            marginVertical: 24,
            borderRadius: 20,
          }}
        >
          <Text style={[styles.subTitle, { fontSize: 20 }]}>User Data</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>Name:</Text>
            <Text style={{ flex: 1, fontSize: 16 }}>
              {userData?.first_name} {userData?.last_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>Email:</Text>
            <Text style={{ flex: 1, fontSize: 16 }}>{userData?.email}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>Phone Number:</Text>
            <Text style={{ flex: 1, fontSize: 16 }}>
              {userData?.phone_number}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.color_white,
            paddingHorizontal: 16,
            paddingBottom: 16,
            marginTop: 0,
            borderRadius: 20,
          }}
        >
          <Text style={[styles.subTitle, { fontSize: 20 }]}>
            Appointment Data
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>ID:</Text>
            <Text style={{ flex: 1, fontSize: 16 }}>#{item?.booked_id}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>Date:</Text>
            <Text style={{ flex: 1, fontSize: 16 }}>
              {dayjs(item?.booked_date).format("DD MMMM YYYY")}{" "}
              {item?.booked_time}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>Type:</Text>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                textTransform: "capitalize",
                fontWeight: "bold",
                color: colors.color_primary,
              }}
            >
              {item?.appointment_type}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.button_container}>
        <Button
          text={"Join Call"}
          disabled={isBeforeBookedDateTime}
          onPress={() => {
            navigation.navigate("CallScreen");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  out_container: { flex: 1 },
  container: {
    flexGrow: 1,
    marginTop: 48,
    paddingHorizontal: 24,
  },
  header_container: {
    flexDirection: "row",
    backgroundColor: colors.color_white,
    marginTop: 36,
    padding: 16,
    borderRadius: 20,
  },

  calendar_container: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
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
  text_container: {
    flex: 1,
    flexDirection: "row",
  },
  time_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    backgroundColor: colors.color_white,
    borderRadius: 20,
    justifyContent: "space-between",
  },
  bottom_container: {
    flex: 1,
    marginBottom: 24,
  },
  button_container: {
    flexDirection: "row",
    marginBottom: 126,
    paddingHorizontal: 24,
  },
  about: {
    fontSize: 20,
    fontFamily: "Mulish_300Light",
    textTransform: "capitalize",
  },

  title: {
    fontSize: 24,
    fontFamily: "Mulish_500Medium",
  },
  subTitle: {
    fontSize: 18,
    paddingVertical: 16,
  },
  desc: {
    fontSize: 14,
    fontFamily: "Mulish_300Light",
  },
  location: {
    fontSize: 16,
    fontFamily: "Mulish_300Light",
    flex: 1,
    color: colors.color_primary,
    justifyContent: "center",
  },
});
