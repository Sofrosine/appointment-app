import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "../../screens/SearchScreen";
import ServiceDetailScreen from "../../screens/ServiceDetailScreen";
import ServiceBookingScreen from "../../screens/ServiceBookingScreen";
import SignInScreen from "../../screens/SignInScreen";

const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceDetailScreen"
        component={ServiceDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceBookingScreen"
        component={ServiceBookingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
