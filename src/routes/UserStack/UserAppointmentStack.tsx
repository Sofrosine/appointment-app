import { createStackNavigator } from "@react-navigation/stack";
import CalendarDetailScreen from "../../screens/CalendarDetailScreen";
import CalendarScreen from "../../screens/CalendarScreen";

const Stack = createStackNavigator();

export default function UserAppointmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CalendarDetailScreen"
        component={CalendarDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
