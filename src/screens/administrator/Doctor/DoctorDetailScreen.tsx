import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { app, getAuth } from "../../../../firebaseConfig";
import Button from "../../../components/Button";
import InputBar from "../../../components/InputBar";
import { colors } from "../../../styles/Theme";
import UploadImage from "../../../components/UploadImage";
import { showTopMessage } from "../../../utils/ErrorHandler";
import { FontAwesome } from "@expo/vector-icons";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as refStorage,
  uploadBytesResumable,
} from "@firebase/storage";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import parseContentData from "../../../utils/ParseContentData";
import DropDownPicker from "react-native-dropdown-picker";
import { Image } from "expo-image";

const auth = getAuth(app);

let initialFormValues = {
  first_name: "",
  last_name: "",
  about: "",
  appointments: "",
  yoe: "",
};

export default function DoctorDetailScreen({ navigation, route }) {
  const { doctor } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>(null);
  const [defaultImage, setDefaultImage] = useState("");
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);

  useEffect(() => {
    if (doctor) {
      setDefaultImage(doctor?.image_url);
      setSelectedCategory(doctor?.expert_area?.id);
      setSubCategory(doctor?.expert_area?.subcategory);
      setSelectedSubCategory(doctor?.skills);
      initialFormValues.first_name = doctor?.first_name;
      initialFormValues.last_name = doctor?.last_name;
      initialFormValues.about = doctor?.about;
      initialFormValues.appointments = doctor?.appointments;
      initialFormValues.yoe = doctor?.yoe;
    }
  }, [doctor]);

  useEffect(() => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, "categories"))
      .then((snapshot) => {
        if (snapshot?.exists()) {
          const categoryList = parseContentData(snapshot?.val());
          setCategories(
            categoryList?.map((cat) => ({
              ...cat,
              value: cat?.id,
              label: cat?.name,
              icon_url: cat?.icon,
              icon: () => (
                <Image
                  source={{ uri: cat?.icon ?? "" }}
                  style={{ height: 24, width: 24 }}
                />
              ),
            }))
          );
        } else {
          showTopMessage("No categories to display", "info");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        // setIsReady(true);
      });

    return () => {
      initialFormValues = {
        first_name: "",
        last_name: "",
        about: "",
        appointments: "",
        yoe: "",
      };
    };
  }, []);

  const handleDelete = async () => {
    if (!doctor?.id) return; // Safety check

    setLoading(true);
    try {
      await deleteDoctor(doctor?.id);
      showTopMessage("Category deleted successfully", "success");
      if (doctor) {
        navigation.reset({
          routes: [{ name: "DoctorScreen" }],
        });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error deleting delete:", error);
      showTopMessage("Error deleting delete", "danger");
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (doctorId) => {
    const db = getDatabase(app);
    const doctorRef = ref(db, `doctors/${doctorId}`);

    // Deletion Logic (including image if it exists)
    await remove(doctorRef) // Remove doctor data
      .then(() => {
        if (doctor?.icon) {
          const storage = getStorage(app);
          const imageRef = refStorage(storage, doctor.icon);
          deleteObject(imageRef).catch((error) => {
            console.error("Error deleting image:", error);
            showTopMessage("Error delete image", "danger");
          });
        }
      })
      .catch(async (error) => {
        console.error("Error deleting doctor:", error);
        showTopMessage("Error delete doctor", "danger");
      });
  };

  const validate = (formValues) => {
    let isValidate = true;

    if (formValues?.first_name === "") {
      isValidate = false;
    }

    if (formValues?.last_name === "") {
      isValidate = false;
    }
    if (formValues?.about === "") {
      isValidate = false;
    }
    if (formValues?.appointments === "") {
      isValidate = false;
    }
    if (formValues?.yoe === "") {
      isValidate = false;
    }
    if (!selectedCategory) {
      isValidate = false;
    }

    return isValidate;
  };

  const handleFormSubmit = async (formValues) => {
    if (validate(formValues)) {
      setLoading(true);
      try {
        if (!image) {
          if (!defaultImage) {
            showTopMessage("Please complete the form first", "warning");
            return;
          }
        }

        // Upload image to Firebase Storage
        const imageUrl = image
          ? await uploadImageToFirebase(image)
          : defaultImage;

        if (imageUrl) {
          // Save category data to Firebase Realtime Database
          await saveDoctorToFirebase({
            first_name: formValues.first_name,
            last_name: formValues.last_name,
            yoe: formValues.yoe,
            appointments: formValues.appointments,
            about: formValues.about,
            image_url: imageUrl,
            unavailable_dates: [],
            skills: selectedSubCategory ?? [],
            expert_area: {
              ...categories?.filter((val) => val?.id === selectedCategory)[0],
              icon: categories?.filter((val) => val?.id === selectedCategory)[0]
                ?.icon_url,
            },
          });
        } else {
          showTopMessage("Error upload image", "danger");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        showTopMessage("Error adding category", "danger");
      } finally {
        setLoading(false);
      }
    } else {
      showTopMessage("Please complete the form first", "warning");
    }
  };

  const uploadImageToFirebase = async (image: ImagePicker.ImagePickerAsset) => {
    const storage = getStorage(app);
    const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
    const storageRef = refStorage(storage, `doctors/${filename}`);

    // Convert URI to Blob
    const response = await fetch(image.uri);
    const blob = await response.blob();

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress if needed
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          );
        }
      );
    });
  };

  const saveDoctorToFirebase = async (doctorData) => {
    const db = getDatabase(app);
    const newCategoryRef = doctor
      ? ref(db, `doctors/${doctor?.id}`)
      : push(child(ref(db), "doctors"));
    set(newCategoryRef, doctorData)
      .then(async () => {
        // Reset form values and state
        setImage(null);
        setSubCategory([]);

        // Show success message or navigate to next screen
        showTopMessage(
          doctor
            ? "Category update successfully"
            : "Category added successfully",
          "success"
        );
        if (doctor) {
          navigation.reset({
            routes: [{ name: "DoctorScreen" }],
          });
        } else {
          navigation.goBack();
        }
      })
      .catch(async (error) => {
        // Deletion logic:
        if (doctorData?.icon) {
          // Check if icon URL exists
          const storage = getStorage(app);
          const imageRef = refStorage(storage, doctorData?.icon);

          // Attempt to delete the image
          await deleteObject(imageRef).catch((error) => {
            console.error("Error deleting image:", error);
          });
          showTopMessage(
            doctor ? "Error update doctor" : "Error adding doctor",
            "danger"
          );
        } else {
          showTopMessage(
            doctor ? "Error update doctor" : "Error adding doctor",
            "danger"
          );
        }
      });
  };

  const handleAddSubCategory = (val: string) => {
    if (selectedSubCategory.includes(val)) {
      setSelectedSubCategory(selectedSubCategory?.filter((sc) => sc !== val));
    } else {
      setSelectedSubCategory([...selectedSubCategory, val]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 120,
        }}
      >
        <Text style={styles.header_text}>
          {doctor ? "Update" : "Add"} Doctor
        </Text>
        <Formik initialValues={initialFormValues} onSubmit={handleFormSubmit}>
          {({ values, handleChange, handleSubmit }) => (
            <>
              <View style={{ alignItems: "center", marginTop: 16 }}>
                <UploadImage
                  defaultImage={defaultImage}
                  placeholderImage={require("../../../../assets/question.svg")}
                  onSelect={(img) => setImage(img)}
                />
                <View style={{ width: "100%", marginTop: 20 }}>
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
                  <View
                    style={{ marginBottom: subCategory?.length > 0 ? 16 : 8 }}
                  >
                    <DropDownPicker
                      open={open}
                      value={selectedCategory}
                      items={categories}
                      setOpen={setOpen}
                      setValue={setSelectedCategory}
                      onSelectItem={(item) => {
                        setSubCategory(
                          categories?.filter((val) => val?.id === item?.id)[0]
                            ?.subcategory
                        );
                        if (selectedSubCategory?.length > 0) {
                          setSelectedSubCategory([]);
                        }
                      }}
                      setItems={setCategories}
                      placeholder="Select Expertise"
                      style={styles.dropdown}
                    />
                    {subCategory?.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 4,
                        }}
                      >
                        {subCategory?.map((sc) => {
                          return (
                            <TouchableOpacity
                              onPress={() => handleAddSubCategory(sc)}
                              style={{
                                borderWidth: 1,
                                borderRadius: 20,
                                borderColor: colors.color_primary,
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                                backgroundColor: selectedSubCategory?.includes(
                                  sc
                                )
                                  ? colors.color_primary
                                  : "transparent",
                              }}
                              key={sc}
                            >
                              <Text
                                style={{
                                  color: selectedSubCategory?.includes(sc)
                                    ? colors.color_white
                                    : colors.color_primary,
                                  fontSize: 14,
                                  fontWeight: "500",
                                }}
                              >
                                {sc}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                  <InputBar
                    onChangeText={handleChange("about")}
                    value={values.about}
                    placeholder={"About"}
                  />
                  <InputBar
                    onChangeText={handleChange("appointments")}
                    value={values.appointments}
                    placeholder={"Total Appointments"}
                    keyboardType="number-pad"
                  />
                  <InputBar
                    onChangeText={handleChange("yoe")}
                    value={values.yoe}
                    placeholder={"Years of Experience"}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <View style={{ marginTop: 40 }}>
                <Button
                  text={doctor ? "Update" : "Submit"}
                  onPress={handleSubmit}
                  loading={loading}
                />
                {doctor && (
                  <View style={{ marginTop: 16 }}>
                    <Button
                      text="Delete"
                      style={{ backgroundColor: "red" }}
                      onPress={handleDelete}
                      loading={loading}
                    />
                  </View>
                )}
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header_text: {
    fontSize: 34,
    fontFamily: "Mulish_500Medium",
    color: colors.color_primary,
    flex: 1,
    marginBottom: 16,
  },

  dropdown: {
    borderColor: colors.color_light_gray,
    backgroundColor: colors.color_light_gray,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 8,
  },
});
