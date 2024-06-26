import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import InputBar from "../components/InputBar";
import {
  browserLocalPersistence,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../../firebaseConfig";
import { Formik } from "formik";
import ErrorHandler, { showTopMessage } from "../utils/ErrorHandler";
import { colors } from "../styles/Theme";
import { getDatabase, onValue, ref } from "firebase/database";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/auth";
import Button from "../components/Button";

const initialFormValues = {
  usermail: "",
  password: "",
};

const SignInScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function handleFormSubmit(formValues) {
    const auth = getAuth(app);

    setLoading(true); // Enable loading when the process starts

    signInWithEmailAndPassword(auth, formValues.usermail, formValues.password)
      .then((userCredential) => {
        const uid = userCredential?.user?.uid;
        fetchUserData(uid);
      })
      .catch((err) => {
        setLoading(false);
        showTopMessage(ErrorHandler(err.code), "danger");
      });
  }

  const fetchUserData = (uid) => {
    const database = getDatabase(app);
    const userRef = ref(database, "users/" + uid);

    onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          storeData(userData); // Store data in AsyncStorage
        } else {
          console.log("User data not found.");
        }
      },
      {
        onlyOnce: true, // Fetch the data only once
      }
    );
  };

  const storeData = async (userData) => {
    try {
      // await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
      dispatch(setUser({ data: userData }));
      showTopMessage("SignIn Successful!", "success");
      setLoading(false);
      goToUserProfile();
    } catch (error) {
      console.error("Error saving to AsyncStorage: ", error);
      showTopMessage("Error storing data", "danger");
      setLoading(false);
    }
  };

  // Navigation

  function goToMemberSignUp() {
    navigation.navigate("SignUpScreen");
  }

  // Navigation

  function goToUserProfile() {
    navigation.navigate("UserProfileScreen");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Sign In </Text>
      <Formik initialValues={initialFormValues} onSubmit={handleFormSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <>
            <View>
              <InputBar
                onChangeText={handleChange("usermail")}
                value={values.usermail}
                placeholder={"Email Address"}
              />
              <InputBar
                onChangeText={handleChange("password")}
                value={values.password}
                placeholder={"Password"}
                secureTextEntry
              />
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ForgotPasswordScreen");
                  }}
                  style={styles.button}
                >
                  <Text style={styles.detail}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.button_container}>
              <View style={styles.button}>
                <Button
                  text="Sign In"
                  onPress={handleSubmit}
                  loading={loading}
                />
              </View>
              <View style={styles.button}>
                <Button
                  text="Sign Up"
                  onPress={goToMemberSignUp}
                  theme="secondary"
                />
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                gap: 8,
                borderTopWidth: 1,
                marginTop: 16,
                paddingTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("SignInAdministratorScreen")}
                style={styles.button}
              >
                <Text
                  style={[
                    styles.detail,
                    { color: colors.color_primary, fontWeight: "bold" },
                  ]}
                >
                  Sign in as an administrator
                </Text>
              </TouchableOpacity>
              <Text style={[styles.detail, { fontWeight: "bold" }]}>Or</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignInDoctorScreen")}
                style={styles.button}
              >
                <Text
                  style={[
                    styles.detail,
                    { color: colors.color_primary, fontWeight: "bold" },
                  ]}
                >
                  Sign in as a doctor
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 48,
    paddingHorizontal: 24,
  },
  text: {
    marginVertical: 32,
    fontSize: 30,
    fontFamily: "Mulish_500Medium",
  },
  detail: {
    fontSize: 14,
    fontFamily: "Mulish_500Medium",
    color: colors.color_gray,
  },
  button_container: {
    paddingVertical: 8,
  },
  button: {
    paddingVertical: 8,
    flexDirection: "row",
  },
});

export default SignInScreen;
