
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { colors } from "../styles/Theme";
import { child, get, getDatabase, ref } from "firebase/database";
import parseContentData from "../utils/ParseContentData";
import CardAppointmentSmall from "../components/CardAppointmentSmall";
import { sortAppointmentsByDateAndTime } from "../utils/CalendarUtils";
import { app, getAuth } from "../../firebaseConfig";

const auth = getAuth(app);
export default function NotificationsScreen({ navigation }) {
  const [appointmentList, setAppointmentList] = useState([]);
  const [userAuth, setUserAuth] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const user = auth?.currentUser;

  useEffect(() => {
    auth?.onAuthStateChanged((userAuth) => {
      setUserAuth(!!userAuth);
    });
  }, []);

  useEffect(() => {
    if (userAuth) {
      const dbRef = ref(getDatabase());

      get(child(dbRef, "appointments/" + user?.uid))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const getList = parseContentData(snapshot.val());

            const servicePromises = getList.map((appointment) =>
              fetchServiceInfo(appointment.serviceId)
            );

            Promise.all(servicePromises).then((serviceInfos) => {
              const updateAppointmentList = getList.map(
                (appointment, index) => ({
                  ...appointment,
                  serviceInfo: serviceInfos[index],
                })
              );
              setAppointmentList(
                sortAppointmentsByDateAndTime(updateAppointmentList)
              );

              setIsReady(true);
            });
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {});
    } else {
      setAppointmentList([]);
      setTimeout(() => {
        setIsReady(true);
      }, 2000);
    }
  }, [userAuth]);

  function fetchServiceInfo(id) {
    const dbRef = ref(getDatabase(), "services/" + id);

    return get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  function goToCalendar() {
    navigation.navigate("CalendarScreen");
  }

  return (
    <ScrollView>
      {isReady && (
        <View style={styles.container}>
          <View style={styles.app_container}>
            {appointmentList.length === 0 ? (
              ""
            ) : (
              <View style={styles.list_container}>
                <Text style={styles.header_text}>My Notifications</Text>
                <View>
                  {appointmentList.slice(0, 2).map((appointment) => (
                    <CardAppointmentSmall
                      appointment={appointment}
                      serviceInfo={appointment.serviceInfo}
                      key={appointment.id}
                      onPress={goToCalendar}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      )}
      {!isReady && (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color={colors.color_primary} />
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
  app_container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  list_container: {
    flex: 1,
  },
  header_text: {
    marginVertical: 16,
    fontSize: 30,
    fontFamily: "Mulish_500Medium",
  },
  loading_container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
});
