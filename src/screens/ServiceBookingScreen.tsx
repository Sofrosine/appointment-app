import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import dayjs from "dayjs";
import { child, get, getDatabase, push, ref, set } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "react-native-calendars";
import { app, getAuth } from "../../firebaseConfig";
import Button from "../components/Button";
import TimeSlot from "../components/TimeSlot";
import { useAppSelector } from "../hooks";
import { colors } from "../styles/Theme";
import { showTopMessage } from "../utils/ErrorHandler";
import {
  configureNotifications,
  handleNotification,
} from "../utils/NotificationService";
import parseContentData from "../utils/ParseContentData";

const auth = getAuth(app);

export default function ServiceBookingScreen({ route, navigation }) {
  const { item } = route.params || {};
  const doctorId = item?.id;
  const scrollViewRef = useRef(null);

  const { data: userData } = useAppSelector((state) => state.authReducer) || {};

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeList, setTimeList] = useState([]);
  const [doctorTimeList, setDoctorTimeList] = useState([]);
  const [bookedApps, setBookedApps] = useState([]);
  const [appointmentType, setAppointmentType] = useState<"audio" | "video">(
    "audio"
  );

  const today = dayjs().format("YYYY-MM-DD");
  const threeMonthsLater = dayjs().add(3, "months").format("YYYY-MM-DD");

  const user = auth?.currentUser;

  useEffect(() => {
    configureNotifications();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getTimeListFromDatabase();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
    }
  }, [selectedDate]);

  const getTimeListFromDatabase = async () => {
    setLoading(true);
    try {
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, "times"));

      if (snapshot.exists()) {
        const timeList = parseContentData(snapshot.val());
        setTimeList(timeList);
      } else {
        console.log("No data time list");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceAppointments = async (day) => {
    setLoading(true);
    setDoctorTimeList([]);

    try {
      const appointmentsRef = ref(getDatabase(), "appointments");
      const snapshot = await get(appointmentsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        let serviceBookings = [];

        Object.keys(data).forEach((user) => {
          const appointments = data[user];

          Object.keys(appointments).forEach((appointmentId) => {
            const app = appointments[appointmentId];

            if (app?.doctor_id === doctorId && app?.booked_date === day) {
              serviceBookings.push(app);
            }
          });
        });

        setBookedApps(serviceBookings);

        const availableTimes = timeList?.map((time) => {
          const bookedHour = serviceBookings.some(
            (app) => app?.booked_time === time?.app_time
          );

          return {
            ...time,
            is_booked: bookedHour ? true : false,
          };
        });

        setDoctorTimeList(availableTimes);
      } else {
        setDoctorTimeList(timeList);
        console.log("No data");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      return true;
    }
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime && user) {
      Alert.alert(
        "Create Appointment",
        "Your appointment will be created, are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: () => {
              pushAppointment();
            },
          },
        ]
      );
    } else {
      if (!user) {
        showTopMessage("You are not logged in", "success");
        goToSignInScreen();
      } else if (!selectedDate || !selectedTime) {
        showTopMessage("Please select a date and a time.", "info");
      }
    }
  };

  const pushAppointment = async () => {
    const userId = user?.uid;
    const doctorId = item?.id;
    const type = item?.expert_area;
    const bookedDate = selectedDate;
    const bookedTime = selectedTime;

    const appointmentsRef = ref(getDatabase(), "appointments/" + user?.uid);

    // Retrieve the last used appointment ID
    const lastAppointmentIdSnapshot = await get(
      child(ref(getDatabase()), "lastAppointmentId")
    );
    let lastAppointmentId = parseInt(lastAppointmentIdSnapshot.val()) || 0;

    // Generate the new appointment ID
    const newAppointmentId = (lastAppointmentId + 1)
      .toString()
      .padStart(4, "0");

    push(appointmentsRef, {
      user_id: userId,
      user: userData,
      doctor_id: doctorId,
      doctor: item,
      type,
      booked_id: newAppointmentId,
      booked_date: bookedDate,
      booked_time: bookedTime,
      appointment_type: appointmentType,
    })
      .then(async () => {
        showTopMessage("Your appointment has been created!", "success");
        await set(ref(getDatabase(), "lastAppointmentId"), newAppointmentId);
        handleNotification(
          "Upcoming Appointment",
          `Your appointment for ${bookedDate}, at ${bookedTime} has been created.`
        );
        goToCompletedScreen();
        setSelectedTime(null);
        setSelectedDate(null);
      })
      .catch((error) => {
        showTopMessage("An error occurred.", "info");
        console.error(error);
        setSelectedTime(null);
        setSelectedDate(null);
      });
  };

  const onDateSelect = async (day) => {
    try {
      setLoading(true);
      setSelectedDate(day?.dateString);
      setSelectedTime(null);
      await getServiceAppointments(day?.dateString);
      scrollViewRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const goToCompletedScreen = () => {
    navigation.navigate("SearchScreen");
  };

  const goToSignInScreen = () => {
    navigation.navigate("SignInScreen");
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
            source={{ uri: item?.image_url }}
          />
          <View>
            <View style={styles.title_container}>
              <Text style={styles.title}>
                {item?.first_name} {item?.last_name}
              </Text>
              <Text style={styles.about}>{item?.expert_area?.name} Expert</Text>
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

        <View style={styles.text_container}>
          <Text style={styles.subTitle}>Select Appointment Type:</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => {
              setAppointmentType("audio");
            }}
            style={[
              styles.inactiveType,
              {
                backgroundColor:
                  appointmentType === "audio"
                    ? colors.color_primary
                    : "transparent",
              },
            ]}
          >
            <FontAwesome
              color={appointmentType === "audio" ? colors.color_white : "black"}
              size={20}
              name="music"
            />
            <Text
              style={{
                fontFamily: "Mulish_500Medium",
                fontSize: 14,
                color:
                  appointmentType === "audio" ? colors.color_white : "black",
              }}
            >
              Audio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAppointmentType("video");
            }}
            style={[
              styles.inactiveType,
              {
                backgroundColor:
                  appointmentType === "video"
                    ? colors.color_primary
                    : "transparent",
              },
            ]}
          >
            <FontAwesome
              color={appointmentType === "video" ? colors.color_white : "black"}
              size={20}
              name="video-camera"
            />
            <Text
              style={{
                fontFamily: "Mulish_500Medium",
                fontSize: 14,
                color:
                  appointmentType === "video" ? colors.color_white : "black",
              }}
            >
              Video Call
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.text_container}>
          <Text style={styles.subTitle}>Select Date:</Text>
        </View>

        <Calendar
          style={styles.calendar_container}
          onDayPress={!loading ? onDateSelect : undefined}
          markedDates={{
            [selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: colors.color_primary,
              selectedTextColor: colors.color_white,
            },
          }}
          customStyle={{
            today: {
              todayTextColor: colors.color_primary,
            },
          }}
          disableAllTouchEventsForDisabledDays
          minDate={today}
          maxDate={threeMonthsLater}
        />

        {selectedDate && (
          <View style={styles.bottom_container}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <>
                <View style={styles.text_container}>
                  <Text style={styles.subTitle}>Select Time:</Text>
                </View>
                <View style={styles.time_container}>
                  {doctorTimeList?.map((time) => (
                    <TimeSlot
                      key={time?.id?.toString()}
                      time={time}
                      onPress={onTimeSelect}
                      isSelected={selectedTime === time?.app_time}
                      isDisabled={
                        selectedDate && item?.unavailable_dates
                          ? item?.unavailable_dates[selectedDate]?.includes(
                              time?.app_time
                            )
                          : false
                      }
                      isBooked={time?.is_booked}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.button_container}>
        <Button text={"Complete"} onPress={handleBooking} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inactiveType: {
    borderWidth: 1,
    borderColor: colors.color_primary,
    borderRadius: 8,
    padding: 8,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 8,
  },
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
