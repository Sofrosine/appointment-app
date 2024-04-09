import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { colors } from "../styles/Theme";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

interface Props {
  onSelect: (img: ImagePicker.ImagePickerAsset) => void;
  placeholderImage?: ImageSourcePropType;
  defaultImage?: string;
}

const UploadImage: FC<Props> = ({
  onSelect,
  defaultImage,
  placeholderImage = require("../../assets/user-profile.png"),
}) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (defaultImage) {
      setImage(defaultImage);
    }
  }, [defaultImage]);

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onSelect && onSelect(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Image source={placeholderImage} style={styles.image} />
      )}
      <View style={styles.uploadButtonContainer}>
        <TouchableOpacity onPress={addImage} style={styles.uploadButton}>
          <Text style={styles.desc}>{image ? "Edit" : "Upload"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    borderRadius: 50,
    overflow: "hidden",
    width: 72,
    height: 72,
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonContainer: {
    opacity: 0.5,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: colors.color_gray,
    width: "100%",
    height: "25%",
  },
  desc: {
    fontSize: 12,
    fontFamily: "Mulish_300Light",
    color: colors.color_white,
  },
  image: {
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    overflow: "hidden",
    width: 72,
    height: 72,
  },
});

export default UploadImage;
