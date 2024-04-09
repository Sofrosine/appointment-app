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
import { child, getDatabase, push, ref, remove, set } from "firebase/database";

const auth = getAuth(app);

const initialFormValues = {
  name: "",
  subcategory: "",
};

export default function CategoryDetailScreen({ navigation, route }) {
  const { category } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>(null);
  const [defaultImage, setDefaultImage] = useState("");
  const [subCategory, setSubCategory] = useState([]);

  useEffect(() => {
    if (category) {
      setDefaultImage(category?.icon);
      setSubCategory(category?.subcategory);
      initialFormValues.name = category?.name;
    }
  }, [category]);

  const handleDelete = async () => {
    if (!category?.id) return; // Safety check

    setLoading(true);
    try {
      await deleteCategory(category.id);
      showTopMessage("Category deleted successfully", "success");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting category:", error);
      showTopMessage("Error deleting category", "danger");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    const db = getDatabase(app);
    const categoryRef = ref(db, `categories/${categoryId}`);

    // Deletion Logic (including image if it exists)
    await remove(categoryRef) // Remove category data
      .then(() => {
        if (category?.icon) {
          const storage = getStorage(app);
          const imageRef = refStorage(storage, category.icon);
          deleteObject(imageRef).catch((error) => {
            console.error("Error deleting image:", error);
            showTopMessage("Error delete image", "danger");
          });
        }
      })
      .catch(async (error) => {
        console.error("Error deleting category:", error);
        showTopMessage("Error delete category", "danger");
      });
  };

  const handleFormSubmit = async (formValues) => {
    setLoading(true);
    try {
      if (formValues?.name === "") {
        showTopMessage("Please complete the form first", "warning");
        return;
      }

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
        await saveCategoryToFirebase({
          name: formValues.name,
          icon: imageUrl,
          subcategory: subCategory,
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
  };

  const uploadImageToFirebase = async (image: ImagePicker.ImagePickerAsset) => {
    const storage = getStorage(app);
    const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
    const storageRef = refStorage(storage, `categories/${filename}`);

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

  const saveCategoryToFirebase = async (categoryData) => {
    const db = getDatabase(app);
    const newCategoryRef = category
      ? ref(db, `categories/${category?.id}`)
      : push(child(ref(db), "categories"));
    set(newCategoryRef, categoryData)
      .then(async () => {
        // Reset form values and state
        setImage(null);
        setSubCategory([]);

        // Show success message or navigate to next screen
        showTopMessage(
          category
            ? "Category update successfully"
            : "Category added successfully",
          "success"
        );
        navigation.goBack();
      })
      .catch(async (error) => {
        // Deletion logic:
        if (categoryData?.icon) {
          // Check if icon URL exists
          const storage = getStorage(app);
          const imageRef = refStorage(storage, categoryData?.icon);

          // Attempt to delete the image
          await deleteObject(imageRef).catch((error) => {
            console.error("Error deleting image:", error);
          });
          showTopMessage(
            category ? "Error update category" : "Error adding category",
            "danger"
          );
        } else {
          showTopMessage(
            category ? "Error update category" : "Error adding category",
            "danger"
          );
        }
      });
  };

  const handleAddSubCategory = (val: string) => {
    setSubCategory([...subCategory, val]);
  };

  const removeSubCategory = (subcategoryToRemove: string) => {
    setSubCategory(subCategory.filter((sc) => sc !== subcategoryToRemove));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <Text style={styles.header_text}>
          {category ? "Update" : "Add"} Category
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
                    onChangeText={handleChange("name")}
                    value={values.name}
                    placeholder={"Name"}
                  />
                  <View>
                    <InputBar
                      onChangeText={handleChange("subcategory")}
                      value={values.subcategory}
                      placeholder={"Sub category"}
                    />
                    {subCategory?.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 16,
                        }}
                      >
                        {subCategory?.map((sc) => {
                          return (
                            <View
                              style={{
                                borderWidth: 1,
                                borderRadius: 20,
                                borderColor: colors.color_primary,
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                              }}
                              key={sc}
                            >
                              <Text
                                style={{
                                  color: colors.color_primary,
                                  fontSize: 14,
                                  fontWeight: "500",
                                }}
                              >
                                {sc}
                              </Text>
                              <TouchableOpacity
                                hitSlop={{
                                  top: 8,
                                  right: 8,
                                  bottom: 8,
                                }}
                                onPress={() => removeSubCategory(sc)}
                              >
                                <FontAwesome
                                  name="close"
                                  color={colors.color_primary}
                                  size={16}
                                />
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <View />
                    )}
                    <View style={{ position: "absolute", right: 8, top: 13 }}>
                      <Button
                        text="Add"
                        onPress={() => {
                          handleAddSubCategory(values?.subcategory);
                          handleChange("subcategory")("");
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 40 }}>
                <Button
                  text={category ? "Update" : "Submit"}
                  onPress={handleSubmit}
                  loading={loading}
                />
                {category && (
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
    marginTop: 48,
    marginBottom: 120,
  },

  header_text: {
    fontSize: 34,
    fontFamily: "Mulish_500Medium",
    color: colors.color_primary,
    flex: 1,
    marginBottom: 16,
  },
});
