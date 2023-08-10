import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    FlatList,
    ScrollView,
} from "react-native";
import Button from "../components/button/Button";
import Colors from "../utils/Colors";

const deviceSize = Dimensions.get("window");

export default function ServiceDetailScreen({ route, navigation }) {
    const { item } = route.params;

    //Read skills
    const renderSkills = ({ item }) => (
        <Text style={styles.chips}> {item} </Text>
    );

    const divider = () => <View style={styles.divider} />;

    const goToBookingScreen = (item) => {
        navigation.navigate("ServiceBookingScreen", { item });
    };

    return (
        <View style={styles.out_container}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header_container}>
                    <Image
                        style={styles.image_container}
                        source={require("../../assets/user-profile.png")}
                    />
                    <View style={styles.title_container}>
                        <Text style={styles.title}>
                            {item.firstName} {item.lastName}
                        </Text>
                        <Text style={styles.desc}>
                            {item.expert_area}, {item.district}
                        </Text>
                    </View>
                </View>
                {/* Body */}
                <View style={styles.body_container}>
                    <View style={styles.title_container}>
                        <Text style={styles.info}>About</Text>

                        <FlatList
                            data={item.skills}
                            renderItem={renderSkills}
                            horizontal={true}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={divider}
                        />

                        <Text style={styles.desc}>
                            LOREM IPSUM
                        </Text>
                    </View>
                </View>

                <View style={styles.info_container}>
                    <Text style={styles.details}>
                        {" "}
                        {item.experience}+ Deneyim
                    </Text>
                    <Text style={styles.details}>
                        {" "}
                        {item.numberOf_books} Tamamlanmış Randevu
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.button_container}>
                <Button
                    text={"Randevu Al"}
                    onPress={() => goToBookingScreen(item)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    out_container: { flex: 1},
    container: {
        flexGrow: 1,
        marginTop: 48,
        paddingHorizontal: 24,
    },
    header_container: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginTop: 24,
        padding: 16,
        borderRadius: 20,
        borderColor:Colors.color_light_gray,
        borderWidth: 2,
        justifyContent: "center",
    },
    body_container: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginTop: 24,
        padding: 16,
        borderRadius: 20,

        borderColor: Colors.color_light_gray,
        borderWidth: 2,
        justifyContent: "center",
    },
    image_container: {
        marginRight: 16,
        borderRadius: 50,
        overflow: "hidden",
        width: 100,
        height: 100,
    },
    title_container: {
        flex: 1,
        justifyContent: "space-evenly",
    },
    button_container: {
        flexDirection: "row",
        marginVertical: 16,
        bottom:0
    },
    title: {
        fontSize: 24,
        fontFamily:"Mulish-Light"
    },
    info: {
        fontSize: 20,
        fontFamily:"Mulish-Light"
    },
    details: {
        flex: 1,
        fontWeight: "300",
        marginVertical: 24,
        padding: 8,
        fontSize: 20,
        textAlign: "center",
        marginHorizontal: 16,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.color_light_gray,
        width: deviceSize.width / 2 - 60,
        height: deviceSize.width / 2 - 60,
        alignItems: "center",
        fontFamily:"Mulish-Light"
    },
    info_container: {
        flexDirection: "row",
        alignItems: "center",

    },
    chips: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#000",
        fontWeight: "300",
        marginVertical: 24,
        padding: 8,
        borderRadius: 16,
        fontFamily:"Mulish-Light"
    },
    desc: {
        fontSize: 14,
        fontWeight: "300",
        padding: 8,
        fontFamily:"Mulish-Light"
    },
    divider: {
        marginHorizontal: 4,
    },
});
