import { Feather, FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { child, get, getDatabase, ref } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { app, getAuth } from "../../../../firebaseConfig";
import CardAppointmentSmall from "../../../components/CardAppointmentSmall";
import Category from "../../../components/Category";
import SearchBar from "../../../components/SearchBar";
import { useAppSelector } from "../../../hooks";
import { colors } from "../../../styles/Theme";
import { sortAppointmentsByDateAndTime } from "../../../utils/CalendarUtils";
import categories from "../../../utils/Categories";
import parseContentData from "../../../utils/ParseContentData";
import { showTopMessage } from "../../../utils/ErrorHandler";
import CardMedium from "../../../components/CardMedium";

const auth = getAuth(app);
export default function DoctorScreen({ navigation }) {
  const [doctorList, setDoctorList] = useState([]);

  const [isReady, setIsReady] = useState(false);

  const { data: userData } = useAppSelector((state) => state.authReducer) || {};

  const user = auth?.currentUser;

  // User session
  useEffect(() => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, "doctors"))
      .then((snapshot) => {
        if (snapshot?.exists()) {
          const doctorList = parseContentData(snapshot?.val());
          setDoctorList(doctorList);
        } else {
          showTopMessage("No data to display", "info");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isReady ? (
        <View style={styles.container}>
          <View style={styles.top_container}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Doctors</Text>
              <TouchableOpacity
                hitSlop={{
                  top: 16,
                  right: 16,
                  left: 16,
                  bottom: 16,
                }}
                onPress={() => {}}
              >
                <FontAwesome
                  name="plus"
                  size={32}
                  color={colors.color_primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.list_container}>
            <FlatList
              data={doctorList}
              renderItem={({ item }) => {
                return (
                  <CardMedium
                    image_source={item?.image_url}
                    service={item}
                    key={item.id}
                    onSelect={() => {
                      navigation.navigate("ServiceDetailScreen", { item });
                    }}
                  />
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 330 }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color={colors.color_primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    marginBottom: 120,
  },
  top_container: {
    paddingHorizontal: 24,
  },
  card_container: {
    marginVertical: 16,
    padding: 16,
  },
  header_container: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  welcome_container: {
    marginTop: 8,
    marginBottom: 64,
    flexDirection: "row",
    alignItems: "center",
  },
  search_container: {
    flex: 1,
    paddingBottom: 8,
  },
  app_container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  list_container: {
    flex: 1,
    marginVertical: 8,
  },
  category_container: {
    marginVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  header_text: {
    fontSize: 34,
    fontFamily: "Mulish_500Medium",
    color: colors.color_primary,
    flex: 1,
  },
  welcome_text: {
    paddingHorizontal: 8,
    fontSize: 24,
    color: colors.color_white,
    fontFamily: "Mulish_500Medium",
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Mulish_500Medium",
  },
  detail_text: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    color: colors.color_white,
    fontFamily: "Mulish_500Medium",
  },
  welcome_text_bold: {
    color: colors.color_white,
    fontSize: 24,
    fontFamily: "Mulish_700Bold",
  },
  icon: {
    color: colors.color_primary,
  },
  loading_container: {
    alignContent: "center",
    justifyContent: "center",
  },
});
