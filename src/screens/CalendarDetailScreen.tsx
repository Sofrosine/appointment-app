import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import React, { useRef, useState } from "react";
import { app, dbFirestore, getAuth } from "../../firebaseConfig";
import Button from "../components/Button";
import { colors } from "../styles/Theme";
import { useAppSelector } from "../hooks";
import dayjs from "dayjs";
import { CALL_TYPE } from "../constants";
import { doc, getDoc } from "firebase/firestore";
import ReactNativeRecordScreen, {
  RecordingResult,
} from "react-native-record-screen";

const auth = getAuth(app);

export default function CalendarDetailScreen({ route, navigation }) {
  const { item } = route.params || {};

  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef(null);
  const { data: userData } = useAppSelector((state) => state.authReducer) || {};

  // Get current date and time
  const currentTime = dayjs();

  // Convert booked date and time to a Day.js object
  const bookedDateTime = dayjs(`${item?.booked_date} ${item?.booked_time}`);

  // Check if the current time is less than the booked date and time
  const isBeforeBookedDateTime = currentTime?.isBefore(bookedDateTime);

  //checks if room is existing
  const checkMeeting = async () => {
    if (item?.id) {
      setLoading(true);
      const roomRef = doc(dbFirestore, "room", item?.id);
      const roomSnapshot = await getDoc(roomRef);

      // console.log(roomSnapshot.data());
      if (!roomSnapshot.exists() || item?.id === "") {
        // console.log(`Room ${roomId} does not exist.`);
        Alert.alert("Wait for the doctor to start the meeting.");
        setLoading(false);
        return;
      } else {
        navigation.navigate("CallScreen", {
          type: CALL_TYPE.JOIN,
          roomId: item?.id,
          callType: item?.appointment_type,
          pairData: item?.doctor,
        });
      }
      setLoading(false);
    } else {
      Alert.alert("Provide a valid Room ID.");
      setLoading(false);
    }
  };

  const handleStart = async () => {
    // const res = await ReactNativeRecordScreen.startRecording({
    //   mic: true,
    //   fps: 20,
    //   bitrate: 2048000,
    // }).catch((error: any) => {
    //   console.warn(error);
    // });

    // if (res === RecordingResult.PermissionError) {
    //   Alert.alert(res);
    // } else if (res === RecordingResult.Started) {
    checkMeeting();
    // }
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
        <View style={styles.button_container}>
          {item?.is_closed ? (
            <View>
              <Text
                style={{ textAlign: "center", marginTop: 0, fontSize: 20 }}
              >
                This appointment has been closed.
              </Text>
            </View>
          ) : (
            <Button
              text={"Join Call"}
              // disabled={isBeforeBookedDateTime}
              onPress={handleStart}
              loading={loading}
            />
          )}
        </View>
      </ScrollView>
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
    marginBottom: 124,
    marginTop: 40,
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
