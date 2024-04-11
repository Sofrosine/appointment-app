import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { app, getAuth } from "../../firebaseConfig";
import InputBar from "../components/InputBar";
import { setUser } from "../store/slices/auth";
import ErrorHandler, { showTopMessage } from "../utils/ErrorHandler";
import Button from "../components/Button";
import { ROLES } from "../constants";

const initialFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  passwordre: "",
};

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const validate = (formValues) => {
    let isValidate = true;

    if (!formValues?.first_name) {
      isValidate = false;
    }
    if (!formValues?.last_name) {
      isValidate = false;
    }
    if (!formValues?.email) {
      isValidate = false;
    }
    if (!formValues?.phone_number) {
      isValidate = false;
    }
    if (!formValues?.password) {
      isValidate = false;
    }
    if (!formValues?.passwordre) {
      isValidate = false;
    }

    if (!isValidate) {
      showTopMessage("Please complete the form", "warning");
    }
    return isValidate;
  };

  const handleFormSubmit = (formValues) => {
    if (validate(formValues)) {
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
              phone_number: formValues.phone_number,
              image_url: "",
              role: ROLES.USER,
            };

            // Write to the database
            set(ref(getDatabase(), "users/" + uid), userData)
              .then(async () => {
                // await AsyncStorage.setItem(
                //   "@user_data",
                //   JSON.stringify(userData)
                // );
                dispatch(setUser({ data: userData }));
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
          .catch((err) => {
            showTopMessage(ErrorHandler(err?.code), "danger");
            setLoading(false);
          });
      }
    }
  };

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
                onChangeText={handleChange("phone_number")}
                value={values.phone_number}
                placeholder={"Phone Number"}
                keyboardType="number-pad"
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
