import { child, get, getDatabase, ref, remove } from "firebase/database";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import parseContentData from "../utils/ParseContentData";
import { getAuth } from "firebase/auth";
import { colors, sizes } from "../styles/Theme";
import CardAppointment from "../components/CardAppointment";
import { showTopMessage } from "../utils/ErrorHandler";
import { sortAppointmentsByDateAndTime } from "../utils/CalendarUtils";
import {
  configureNotifications,
  handleNotification,
} from "../utils/NotificationService";

export default function CalendarScreen() {
  const [loading, setLoading] = useState(true);
  const [appointmentList, setAppointmentList] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  // Notification setup
  useEffect(() => {
    configureNotifications();
  }, []);

  // Fetch user appointments from the database
  useEffect(() => {
    fetchData();
  }, [appointmentList]);

  const fetchData = () => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, "userAppointments/" + user.uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = parseContentData(snapshot.val());

          const servicePromises = data.map((appointment) =>
            fetchServiceInfo(appointment.serviceId)
          );

          // Wait for all promises to resolve
          Promise.all(servicePromises)
            // Add service information to appointment data
            .then((serviceInfos) => {
              const appointmentList = data.map((appointment, index) => ({
                ...appointment,
                serviceInfo: serviceInfos[index],
              }));
              // Update appointment list sorted by date and time
              setAppointmentList(
                sortAppointmentsByDateAndTime(appointmentList)
              );
            });
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  async function fetchServiceInfo(id) {
    const dbRef = ref(getDatabase(), "services/" + id);

    return get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return null;
        }
      })
      .catch(() => {
        console.error(error);
        return null;
      });
  }

  function removeAppointment(appointment) {
    const appointmentsRef = ref(
      getDatabase(),
      "userAppointments/" + user.uid + "/" + appointment.id
    );

    remove(appointmentsRef)
      .then(() => {
        showTopMessage("Appointment deleted!", "success");
        handleNotification(
          "Appointment Canceled",
          `${appointment.appType} appointment has been canceled.`
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
    <ScrollView style={styles.container}>
      <Text style={styles.header_text}>My Appointments</Text>
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
              {appointmentList.map((appointment) => (
                <CardAppointment
                  appointment={appointment}
                  serviceInfo={appointment.serviceInfo}
                  key={appointment.id}
                  onPressCancel={() => handleCancel(appointment)}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
  },
  header_text: {
    marginHorizontal: 24,
    marginVertical: 16,
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
