import { child, get, getDatabase, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import CardMedium from "../components/CardMedium";
import Category from "../components/Category";
import SearchBar from "../components/SearchBar";
import { colors, sizes } from "../styles/Theme";
import { filterServicesByCategory } from "../utils/CategoryUtils";
import { showTopMessage } from "../utils/ErrorHandler";
import parseContentData from "../utils/ParseContentData";
import { useAppSelector } from "../hooks";

export default function SearchScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [filteredServiceList, setFilteredServiceList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const category = route.params?.category;
  const { data: userData } = useAppSelector((state) => state.authReducer) || {};

  useEffect(() => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, "doctors"))
      .then((snapshot) => {
        if (snapshot?.exists()) {
          const serviceList = parseContentData(snapshot?.val());
          setServiceList(serviceList);

          if (category) {
            const filteredList = filterServicesByCategory(
              category?.name,
              serviceList
            );
            setSelectedCategory(category?.name);
            setFilteredServiceList(filteredList);
          } else {
            setFilteredServiceList(serviceList);
          }
        } else {
          showTopMessage("No data to display", "info");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });

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
      });
  }, [userData]);

  useEffect(() => {
    if (category) {
      const filteredList = filterServicesByCategory(
        category?.name,
        serviceList
      );
      setSelectedCategory(category?.name);
      setFilteredServiceList(filteredList);
    }
  }, [category]);

  const handleCategoryFilter = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      setFilteredServiceList(serviceList);
    } else {
      const filteredList = filterServicesByCategory(category, serviceList);
      setSelectedCategory(category);
      setFilteredServiceList(filteredList);
    }
  };

  const renderService = ({ item }) => (
    <CardMedium
      image_source={item?.image_url}
      service={item}
      key={item.id}
      onSelect={() => handleServiceSelect(item)}
    />
  );

  const renderCategory = ({ item }) => (
    <Category
      category={item}
      isSelected={selectedCategory === item?.name}
      onPress={() => handleCategoryFilter(item?.name)}
      key={item?.name}
    />
  );

  const handleServiceSelect = (item) => {
    navigation.navigate("ServiceDetailScreen", { item });
  };

  const handleSearch = (text) => {
    const searchedText = text?.toLowerCase();

    const filteredList = serviceList?.filter((service) => {
      const skillsMatch = service?.skills?.some((skill) =>
        skill?.toLowerCase()?.includes(searchedText)
      );

      const expertAreaMatch = service?.expert_area
        ?.toLowerCase()
        .includes(searchedText);

      return skillsMatch || expertAreaMatch;
    });

    setFilteredServiceList(filteredList);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color={colors.color_primary}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.search_container}>
            <SearchBar onSearch={handleSearch} placeholder_text={"Search"} />
          </View>

          <View style={styles.category_container}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={sizes.width + 24}
              decelerationRate={"fast"}
              data={categoryList}
              keyExtractor={(category) => category?.name}
              renderItem={renderCategory}
            />
            {/* <TouchableOpacity
              style={{ position: "absolute", right: 0, top: "40%" }}
            >
              <Ionicons name="arrow-forward" size={24} color={colors.color_primary} />
            </TouchableOpacity> */}
          </View>

          <View style={styles.list_container}>
            <FlatList
              data={filteredServiceList}
              renderItem={renderService}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 330 }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search_container: {
    marginTop: 56,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  category_container: {
    marginLeft: 16,
  },
  list_container: {
    marginBottom: 32,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
