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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { app, getAuth } from "../../firebaseConfig";
import { Formik } from "formik";
import ErrorHandler, { showTopMessage } from "../utils/ErrorHandler";
import { getDatabase, ref, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  passwordre: "",
};

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);

  function handleFormSubmit(formValues) {
    const auth = getAuth(app);

    if (formValues.password !== formValues.passwordre) {
      showTopMessage("Passwords do not match, please try again!", "warning");
      setLoading(false);
    } else {
      setLoading(true);
      createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      )
        .then((userCredential) => {
          const user = userCredential?.user;
          const uid = user?.uid;

          // Prepare user data
          const userData = {
            first_name: formValues.first_name,
            last_name: formValues.last_name,
            email: formValues.email,
            image_url: "",
          };

          // Write to the database
          set(ref(getDatabase(), "users/" + uid), userData)
            .then(async () => {
              await AsyncStorage.setItem(
                "@user_data",
                JSON.stringify(userData)
              );
              showTopMessage("Registration successful!", "success");
              setLoading(false);
              // Consider navigating to the user profile or home screen.
            })
            .catch((error) => {
              showTopMessage("Error saving user data", "danger");
              console.error(error);
              // Delete the created user
              userCredential?.user
                .delete()
                .then(() => {
                  showTopMessage("Registration rolled back.", "warning");
                })
                .catch((deleteError) => {
                  // Handle error during deletion (e.g., log the error)
                  console.error("Error deleting user:", deleteError);
                });

              setLoading(false);
            });
        })
        .catch((err) => showTopMessage(ErrorHandler(err?.code), "danger"));
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}> Sign Up </Text>
      <Formik initialValues={initialFormValues} onSubmit={handleFormSubmit}>
        {({ values, handleChange, handleSubmit }) => (
          <>
            <View style={styles.input_container}>
              <InputBar
                onChangeText={handleChange("first_name")}
                value={values.first_name}
                placeholder={"First Name"}
              />
              <InputBar
                onChangeText={handleChange("last_name")}
                value={values.last_name}
                placeholder={"Last Name"}
              />
              <InputBar
                onChangeText={handleChange("email")}
                value={values.email}
                placeholder={"Email Address"}
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
