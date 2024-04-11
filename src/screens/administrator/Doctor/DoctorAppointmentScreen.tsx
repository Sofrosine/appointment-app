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

import { child, get, getDatabase, push, ref, set } from "firebase/database";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { FontAwesome } from "@expo/vector-icons";

const auth = getAuth(app);

export default function DoctorAppointmentScreen({ route, navigation }) {
  const { item } = route.params || {};
  const doctorId = item?.id;
  const scrollViewRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);

  const today = moment().format("YYYY-MM-DD");
  const threeMonthsLater = moment().add(3, "months").format("YYYY-MM-DD");

  const user = auth?.currentUser;

  useEffect(() => {
    configureNotifications();
  }, []);

  useEffect(() => {
    if (item) {
      setUnavailableDates(item?.unavailable_dates ?? []);
    }
  }, [item]);

  const selectedDateMemo = useMemo(() => {
    return selectedDate ?? {};
  }, [selectedDate]);

  const unavailableDatesMemo = useMemo(() => {
    const arr = unavailableDates ? [...unavailableDates] : [];
    const obj = {};
    arr?.forEach((val) => {
      obj[val] = {
        disabled: true,
      };
    });

    return obj;
  }, [unavailableDates]);

  // const getTimeListFromDatabase = async () => {
  //   setLoading(true);
  //   try {
  //     const dbRef = ref(getDatabase());
  //     const snapshot = await get(child(dbRef, "times"));

  //     if (snapshot.exists()) {
  //       const timeList = parseContentData(snapshot.val());
  //       setTimeList(timeList);
  //     } else {
  //       console.log("No data time list");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = () => {
    let parsedData = parseContentData(selectedDate ?? {});
    parsedData = parsedData?.map((val) => val?.id);
console.log(parsedData, unavailableDates)
    const db = getDatabase(app);
    const doctorRef = ref(db, `doctors/${item?.id}`);
    set(doctorRef, {
      ...item,
      unavailable_dates: [...parsedData, ...unavailableDates],
    })
      .then(() => {
        showTopMessage("Success update dates", "success");
        navigation.reset({
          routes: [{ name: "DoctorScreen" }],
        });
      })
      .catch(() => {
        showTopMessage("Error", "danger");
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const onDateSelect = async (day) => {
    const obj = { ...selectedDate };

    if (obj[day?.dateString]) {
      delete obj[day?.dateString];
    } else {
      obj[day?.dateString] = {
        selected: true,
        disableTouchEvent: false,
        selectedColor: colors.color_primary,
        selectedTextColor: colors.color_white,
      };
    }
    setSelectedDate(obj);
  };

  const removeUnavailableDate = (date: string) => {
    setUnavailableDates(unavailableDates?.filter((sc) => sc !== date));
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
          <Text style={styles.subTitle}>Unavailable Dates:</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {unavailableDates?.map((sc) => {
            return (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: colors.color_primary,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
                key={sc}
              >
                <Text
                  style={{
                    color: colors.color_primary,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {sc}
                </Text>
                <TouchableOpacity
                  hitSlop={{
                    top: 8,
                    right: 8,
                    bottom: 8,
                  }}
                  onPress={() => removeUnavailableDate(sc)}
                >
                  <FontAwesome
                    name="close"
                    color={colors.color_primary}
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.text_container}>
          <Text style={styles.subTitle}>Select Date:</Text>
        </View>

        <Calendar
          style={styles.calendar_container}
          onDayPress={onDateSelect}
          markedDates={{
            // [selectedDate]: {
            //   selected: true,
            //   disableTouchEvent: true,
            //   selectedColor: colors.color_primary,
            //   selectedTextColor: colors.color_white,
            // },
            ...selectedDateMemo,
            ...unavailableDatesMemo,
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
      </ScrollView>
      <View style={styles.button_container}>
        <Button loading={submitLoading} text={"Save"} onPress={handleSave} />
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
