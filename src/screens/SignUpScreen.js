import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import Button from "../components/Button/Button";
import InputBar from "../components/InputBar";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../../firebaseConfig";
import { Formik } from "formik";
import ErrorHandler, { showTopMessage } from "../utils/ErrorHandler";

const initialFormValues = {
  usermail: "",
  password: "",
  passwordre: "",
};

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);

  function handleFormSubmit(formValues) {
    const auth = getAuth(app);

    setLoading(true);

    if (formValues.password !== formValues.passwordre) {
      showTopMessage("Passwords do not match, please try again!", "warning");
      setLoading(false);
    } else {
      createUserWithEmailAndPassword(
        auth,
        formValues.usermail,
        formValues.password
      )
        .then(
          (res) => {
            showTopMessage("Registration successful!", "success");
            setLoading(false);
          }
          // navigate to home screen or go back from here
        )
        .catch((err) => showTopMessage(ErrorHandler(err.code), "danger"));

      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}> Sign Up </Text>
      <Formik initialValues={initialFormValues} onSubmit={handleFormSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <>
            <View style={styles.input_container}>
              <InputBar placeholder={"First Name"} />
              <InputBar placeholder={"Last Name"} />
              <InputBar
                onChangeText={handleChange("usermail")}
                value={values.usermail}
                placeholder={"Email Address"}
              />
              <InputBar
                onChangeText={handleChange("phoneNumber")}
                value={values.phoneNumber}
                placeholder={"Phone Number"}
              />
              <InputBar
                onChangeText={handleChange("password")}
                value={values.password}
                placeholder={"Password"}
                secureTextEntry
              />
              <InputBar
                onChangeText={handleChange("passwordre")}
                value={values.passwordre}
                placeholder={"Confirm Password"}
                secureTextEntry
              />
            </View>
            <View style={styles.button_container}>
              <Button
                text="Complete Registration"
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    marginBottom: 60,
  },
  text: {
    marginHorizontal: 24,
    marginVertical: 32,
    fontSize: 30,
    fontFamily: "Mulish_500Medium",
  },
  input_container: {
    marginHorizontal: 24,
  },
  button_container: {
    flexDirection: "row",
    margin: 16,
  },
});
