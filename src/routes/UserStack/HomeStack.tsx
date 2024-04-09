import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/HomeScreen";
import CalendarScreen from "../../screens/CalendarScreen";
import NotificationsScreen from "../../screens/NotificationsScreen";
import SearchScreen from "../../screens/SearchScreen";
import ServiceDetailScreen from "../../screens/ServiceDetailScreen";
import ServiceBookingScreen from "../../screens/ServiceBookingScreen";

const Stack = createStackNavigator();
export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
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
    </Stack.Navigator>
  );
}
