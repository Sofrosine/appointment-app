import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import dayjs from "dayjs";
import { child, get, getDatabase, ref, set } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "react-native-calendars";
import { app, getAuth } from "../../../../firebaseConfig";
import Button from "../../../components/Button";
import TimeSlot from "../../../components/TimeSlot";
import { colors } from "../../../styles/Theme";
import { showTopMessage } from "../../../utils/ErrorHandler";
import {
  configureNotifications,
  handleNotification,
} from "../../../utils/NotificationService";
import parseContentData from "../../../utils/ParseContentData";

const auth = getAuth(app);

export default function AppointmentDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const doctorId = item?.doctor_id;
  const scrollViewRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeList, setTimeList] = useState([]);
  const [doctorTimeList, setDoctorTimeList] = useState([]);
  const [bookedApps, setBookedApps] = useState([]);
  const [userData, setUserData] = useState(null);

  const today = dayjs().format("YYYY-MM-DD");
  const threeMonthsLater = dayjs().add(3, "months").format("YYYY-MM-DD");

  useEffect(() => {
    configureNotifications();
    getUserFromDatabase();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getTimeListFromDatabase();
    };

    fetchData();
  }, [selectedDate]);

  const getUserFromDatabase = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

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
    if (selectedDate && selectedTime) {
      Alert.alert(
        "Update Appointment",
        "Your appointment will be updated, are you sure?",
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
      if (!selectedDate || !selectedTime) {
        showTopMessage("Please select a date and a time.", "info");
      }
    }
  };

  const pushAppointment = async () => {
    const userId = item?.user_id;
    const doctorId = item?.doctor_id;
    const type = item?.doctor?.expert_area;
    const bookedDate = selectedDate;
    const bookedTime = selectedTime;

    const appointmentsRef = ref(
      getDatabase(),
      "appointments/" + `${userId}/` + item?.child_key
    );

    // // Retrieve the last used appointment ID
    // const lastAppointmentIdSnapshot = await get(
    //   child(ref(getDatabase()), "lastAppointmentId")
    // );
    // let lastAppointmentId = parseInt(lastAppointmentIdSnapshot.val()) || 0;

    // // Generate the new appointment ID
    // const newAppointmentId = (lastAppointmentId + 1)
    //   .toString()
    //   .padStart(4, "0");

    set(appointmentsRef, {
      user_id: userId,
      user: userData,
      doctor_id: doctorId,
      doctor: item?.doctor,
      type,
      booked_id: item?.booked_id,
      booked_date: bookedDate,
      booked_time: bookedTime,
    })
      .then(async () => {
        showTopMessage("Your appointment has been updated!", "success");

        handleNotification(
          "Upcoming Appointment",
          `Your appointment for ${bookedDate}, at ${bookedTime} has been updated.`
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

      await getTimeListFromDatabase();
      await getServiceAppointments(day?.dateString);
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
    navigation.goBack();
  };

  return (
    <View style={styles.out_container}>
      <ScrollView
        nestedScrollEnabled={true}
        ref={scrollViewRef}
        style={styles.container}
        onContentSizeChange={(contentWidth, contentHeight) => {
          if (!loading && scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }}
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
            // ...unavailableDates,
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
                        selectedDate &&
                        item &&
                        item?.doctor &&
                        item?.doctor?.unavailable_dates
                          ? item?.doctor?.unavailable_dates[
                              selectedDate
                            ]?.includes(time?.app_time)
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
        <Button text={"Update"} onPress={handleBooking} />
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
