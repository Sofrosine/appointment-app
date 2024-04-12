import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import InputBar from "../components/InputBar";
import {
  browserLocalPersistence,
  getAuth,
  sendPasswordResetEmail,
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
};

const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function handleFormSubmit(formValues) {
    const auth = getAuth(app);

    setLoading(true); // Enable loading when the process starts

    sendPasswordResetEmail(auth, formValues?.usermail)
      .then(() => {
        showTopMessage(
          "Success, please check your email",
          "success"
        );
        navigation.goBack();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}> Forgot Password </Text>
      <Formik initialValues={initialFormValues} onSubmit={handleFormSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <>
            <View>
              <InputBar
                onChangeText={handleChange("usermail")}
                value={values.usermail}
                placeholder={"Email Address"}
              />
            </View>
            <View style={styles.button_container}>
              <View style={styles.button}>
                <Button
                  text="Submit"
                  onPress={handleSubmit}
                  loading={loading}
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

export default ForgotPasswordScreen;
