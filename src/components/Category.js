import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../styles/Theme";
import { Image } from "expo-image";

const windowWidth = Dimensions.get("window").width;
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Category = ({ category, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isSelected ? styles.selectedButton : null]}
      onPress={onPress}
    >
      {/* <FontAwesome5
        name={category?.icon}
        size={36}
        color={isSelected ? colors.color_white : colors.color_primary}
        style={styles.icon}
      /> */}
      <Image
        style={[styles.icon]}
        source={category?.icon}
        placeholder={blurhash}
        placeholderContentFit="cover"
        contentFit="fill"
        transition={1000}
        // tintColor={isSelected ? colors.color_white : colors.color_primary}
      />
      <Text style={[styles.text, isSelected ? styles.selectedText : null]}>
        {category?.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: 8,
    paddingTop: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: colors.color_primary,
    borderWidth: 1,
    width: windowWidth / 4,
    height: windowWidth / 4,
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: colors.color_primary,
  },
  text: {
    color: colors.color_primary,
    fontSize: 12,
    fontFamily: "Mulish_500Medium",
    textAlign: "center",
    textTransform: "capitalize",
  },
  selectedText: {
    color: colors.color_white,
    fontFamily: "Mulish_500Medium",
  },
  icon: {
    height: 36,
    width: 36,
    marginBottom: 8
  },
});

export default Category;
