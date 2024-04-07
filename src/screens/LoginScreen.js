import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../components/Button/Button";
import InputBar from "../components/InputBar";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebaseConfig";
import { Formik } from "formik";
import ErrorHandler, { showTopMessage } from "../utils/ErrorHandler";
import { colors } from "../styles/Theme";

const initialFormValues = {
  usermail: "",
  password: "",
};

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  function handleFormSubmit(formValues) {
    const auth = getAuth(app);

    setLoading(true); // Enable loading when the process starts

    signInWithEmailAndPassword(auth, formValues.usermail, formValues.password)
      .then((res) => {
        showTopMessage("Login Successful!", "success");
        setLoading(false); // Disable loading when the process completes
        goToUserProfile();
      })
      .catch((err) => {
        setLoading(false);
        showTopMessage(ErrorHandler(err.code), "danger");
      });
  }

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
      <Text style={styles.text}> Log In </Text>
      <Formik initialValues={initialFormValues} onSubmit={handleFormSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <>
            <View style={styles.input_container}>
              <InputBar
                onChangeText={handleChange("usermail")}
                value={values.usermail}
                placeholder={"Email Address"}
              />
              <InputBar
                onChangeText={handleChange("password")}
                value={values.password}
                placeholder={"Password"}
                isSecure
              />
              <TouchableOpacity style={styles.button}>
                <Text style={styles.detail}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button_container}>
              <View style={styles.button}>
                <Button
                  text="Log In"
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

export default LoginScreen;
