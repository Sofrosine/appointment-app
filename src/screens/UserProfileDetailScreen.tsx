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
import { useAppSelector } from "../hooks";

const initialFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
};

export default function UserProfileDetailScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const { data: userData } = useAppSelector((state) => state.authReducer) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      initialFormValues.first_name = userData?.first_name;
      initialFormValues.last_name = userData?.last_name;
      initialFormValues.email = userData?.email;
      initialFormValues.phone_number = userData?.phone_number;
    }
  }, [userData]);

  const validate = (formValues) => {
    let isValidate = true;

    if (!formValues?.first_name) {
      isValidate = false;
    }
    if (!formValues?.last_name) {
      isValidate = false;
    }

    if (!isValidate) {
      showTopMessage("Please complete the form", "warning");
    }
    return isValidate;
  };

  const handleFormSubmit = (formValues) => {
    if (validate(formValues)) {
      setLoading(true);
      const db = getDatabase(app);
      const auth = getAuth(app);

      const updateUserRef = ref(db, `users/${auth?.currentUser?.uid}`);
      set(updateUserRef, formValues)
        .then(() => {
          dispatch(
            setUser({
              data: {
                ...userData,
                ...formValues,
              },
            })
          );
          showTopMessage("Profile update successfully", "success");
          navigation.goBack();
        })
        .catch(async (error) => {
          showTopMessage("Fail to update user", "danger");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}> My Account </Text>
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
                editable={false}
              />
              <InputBar
                onChangeText={handleChange("phone_number")}
                value={values.phone_number}
                placeholder={"Phone Number"}
                keyboardType="number-pad"
                editable={false}
              />
            </View>
            <View style={styles.button_container}>
              <Button text="Update" onPress={handleSubmit} loading={loading} />
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
    marginTop: 48,
  },
});
