import { child, get, getDatabase, ref, remove } from "firebase/database";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import parseContentData from "../utils/ParseContentData";
import { colors, sizes } from "../styles/Theme";
import CardAppointment from "../components/CardAppointment";
import { showTopMessage } from "../utils/ErrorHandler";
import { sortAppointmentsByDateAndTime } from "../utils/CalendarUtils";
import {
  configureNotifications,
  handleNotification,
} from "../utils/NotificationService";
import { app, getAuth } from "../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const auth = getAuth(app);
export default function CalendarScreen() {
  const [loading, setLoading] = useState(true);
  const [appointmentList, setAppointmentList] = useState([]);
  const user = auth?.currentUser;

  // Notification setup
  useEffect(() => {
    configureNotifications();
  }, []);

  // Fetch user appointments from the database
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = () => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, "appointments/" + user?.uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = parseContentData(snapshot?.val());
          setAppointmentList(sortAppointmentsByDateAndTime(data));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function removeAppointment(appointment) {
    const appointmentsRef = ref(
      getDatabase(),
      "appointments/" + user?.uid + "/" + appointment.id
    );

    remove(appointmentsRef)
      .then(() => {
        showTopMessage("Appointment deleted!", "success");
        handleNotification(
          "Appointment Canceled",
          `${appointment?.type?.name} appointment has been canceled.`
        );
        if (appointmentList.length == 1) {
          setAppointmentList([]);
        }
        fetchData();
      })
      .catch((error) => {
        showTopMessage("Error while deleting appointment!", "info");
      });
  }

  const handleCancel = (appointment) => {
    Alert.alert(
      "Appointment Cancellation",
      "Your appointment will be canceled, are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Cancel Appointment",
          onPress: () => {
            removeAppointment(appointment);
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header_text}>My Appointments</Text>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loading ? (
          <ActivityIndicator
            style={styles.loading_container}
            size="large"
            color={colors.color_primary}
          />
        ) : (
          <View style={styles.list_container}>
            {appointmentList.length === 0 ? (
              <Text style={styles.emptyViewText}>No appointments found!</Text>
            ) : (
              <View>
                {appointmentList?.map((appointment) => (
                  <CardAppointment
                    onPressDetail={null}
                    appointment={appointment}
                    serviceInfo={appointment?.doctor}
                    key={appointment.id}
                    onPressCancel={() => handleCancel(appointment)}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header_text: {
    marginHorizontal: 24,
    marginTop: 48,
    marginBottom: 16,
    fontSize: 30,
    fontFamily: "Mulish_500Medium",
  },
  list_container: {
    flex: 1,
    justifyContent: "center",
  },
  emptyViewText: {
    fontFamily: "Mulish_500Medium",
    fontSize: 24,
    alignItems: "center",
    marginHorizontal: 24,
  },
  loading_container: {
    position: "absolute",
    top: sizes.height / 2,
    left: sizes.width / 2,
  },
});
