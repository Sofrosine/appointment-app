import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { signOut } from "firebase/auth";
import { app, getAuth } from "../../firebaseConfig";
import { Feather } from "@expo/vector-icons";
import CardSmall from "../components/CardSmall";
import { showTopMessage } from "../utils/ErrorHandler";
import { colors } from "../styles/Theme";
import UploadImage from "../components/UploadImage";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setUser } from "../store/slices/auth";
import { ROLES } from "../constants";
import Setting from "../../app.json";

export default function UserProfileScreen({ navigation }) {
  const { data: userData } = useAppSelector((state) => state.authReducer) || {};
  const dispatch = useAppDispatch();
  // Sign out user
  function handleSignOut() {
    const auth = getAuth(app);

    signOut(auth)
      .then((res) => {
        dispatch(setUser(null));
        showTopMessage("Session ended", "success");
        goToSignIn();
      })
      .catch((err) => console.log(err));
  }

  // Navigation
  function goToSignIn() {
    navigation.navigate("SignInScreen");
  }

  // Navigation
  function goToBookingHistory() {
    navigation.navigate("Appointments");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header_text}>My Profile</Text>

      <View style={styles.section_container}>
        <View style={{ flex: 1 }}>
          <View style={styles.user_card}>
            <View style={styles.title_container}>
              <Text style={styles.title}>
                {userData?.first_name} {userData?.last_name}
              </Text>
              <Text style={styles.desc}>{userData?.email}</Text>
            </View>
            <UploadImage onSelect={() => {}} />
          </View>

          {userData?.role !== ROLES.ADMIN ? (
            <>
              <CardSmall
                onSelect={() => {
                  navigation.navigate("UserProfileDetailScreen");
                }}
                iconName={"user"}
                text={"My Account"}
              />
              <CardSmall
                onSelect={goToBookingHistory}
                iconName={"list"}
                text={"My Booking History"}
              />
            </>
          ) : (
            <View />
          )}
          <TouchableOpacity
            style={styles.logout_container}
            onPress={handleSignOut}
          >
            <Text style={styles.text}>Sign Out </Text>
            <Feather
              style={styles.icon}
              name="log-out"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.logo_container}>
          <Text style={styles.logo_text}>Appointment</Text>
          {/* <Text
            style={{
              marginTop: 8,
              fontFamily: "Mulish_500Medium",
              color: colors.color_gray,
              textAlign: "center",
            }}
          >
            {Setting.expo.android.version} ({Setting.expo.android.versionCode})
          </Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
  },
  user_card: {
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: colors.color_white,
    padding: 16,
  },
  section_container: {
    flex: 1,
    marginBottom: 16,
  },
  text_container: {
    flex: 1,
  },
  title_container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Mulish_500Medium",
  },
  desc: {
    fontSize: 14,
    fontFamily: "Mulish_300Light",
    color: colors.color_gray,
  },
  logout_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  header_text: {
    marginHorizontal: 24,
    marginVertical: 16,
    fontSize: 30,
    fontFamily: "Mulish_500Medium",
  },
  logo_container: {
    // flex: 1,
    marginBottom: 80,
    alignItems: "center",
  },
  logo_text: {
    fontSize: 34,
    fontFamily: "Mulish_500Medium",
    color: colors.color_light_gray,
    textAlign: "center",
  },
  icon: {
    padding: 4,
  },
  text: {
    padding: 8,
    fontSize: 18,
    fontFamily: "Mulish_500Medium",
  },
});
