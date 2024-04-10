import { createStackNavigator } from "@react-navigation/stack";
import AppointmentScreen from "../../screens/administrator/Appointment/AppointmentScreen";
import AppointmentDetailScreen from "../../screens/administrator/Appointment/AppointmentDetailScreen";

const Stack = createStackNavigator();
export default function AppointmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppointmentScreen"
        component={AppointmentScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="AppointmentDetailScreen"
        component={AppointmentDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
