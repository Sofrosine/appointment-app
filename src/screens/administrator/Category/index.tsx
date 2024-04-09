import { FontAwesome } from "@expo/vector-icons";
import { child, get, getDatabase, ref } from "firebase/database";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { app, getAuth } from "../../../../firebaseConfig";
import Category from "../../../components/Category";
import { colors } from "../../../styles/Theme";

import { useFocusEffect } from "@react-navigation/native";
import { showTopMessage } from "../../../utils/ErrorHandler";
import parseContentData from "../../../utils/ParseContentData";

const auth = getAuth(app);
export default function CategoryScreen({ navigation }) {
  const [categoryList, setCategoryList] = useState([]);

  const [isReady, setIsReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const dbRef = ref(getDatabase());

      get(child(dbRef, "categories"))
        .then((snapshot) => {
          if (snapshot?.exists()) {
            const categoryList = parseContentData(snapshot?.val());
            setCategoryList(categoryList);
          } else {
            showTopMessage("No data to display", "info");
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsReady(true);
        });
    }, [])
  );

  return (
    <ScrollView>
      {isReady ? (
        <View style={styles.container}>
          <View style={styles.top_container}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>Categories</Text>
              <TouchableOpacity
                hitSlop={{
                  top: 16,
                  right: 16,
                  left: 16,
                  bottom: 16,
                }}
                onPress={() => {
                  navigation.navigate("CategoryDetailScreen");
                }}
              >
                <FontAwesome
                  name="plus"
                  size={32}
                  color={colors.color_primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.category_container}>
            {categoryList?.map((category) => (
              <Category
                isSelected={false}
                category={category}
                key={category?.name}
                onPress={() => {
                  navigation.navigate("CategoryDetailScreen", {
                    category,
                  });
                }}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color={colors.color_primary} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    marginBottom: 120,
  },
  top_container: {
    paddingHorizontal: 24,
  },
  card_container: {
    marginVertical: 16,
    padding: 16,
  },
  header_container: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  welcome_container: {
    marginTop: 8,
    marginBottom: 64,
    flexDirection: "row",
    alignItems: "center",
  },
  search_container: {
    flex: 1,
    paddingBottom: 8,
  },
  app_container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  list_container: {
    flex: 1,
    marginVertical: 8,
  },
  category_container: {
    marginVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  header_text: {
    fontSize: 34,
    fontFamily: "Mulish_500Medium",
    color: colors.color_primary,
    flex: 1,
  },
  welcome_text: {
    paddingHorizontal: 8,
    fontSize: 24,
    color: colors.color_white,
    fontFamily: "Mulish_500Medium",
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Mulish_500Medium",
  },
  detail_text: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    color: colors.color_white,
    fontFamily: "Mulish_500Medium",
  },
  welcome_text_bold: {
    color: colors.color_white,
    fontSize: 24,
    fontFamily: "Mulish_700Bold",
  },
  icon: {
    color: colors.color_primary,
  },
  loading_container: {
    alignContent: "center",
    justifyContent: "center",
  },
});
