import { createStackNavigator } from "@react-navigation/stack";
import AppointmentDetailScreen from "../../screens/administrator/Appointment/AppointmentDetailScreen";
import DoctorAppointmentScreen from "../../screens/doctor/Appointment/DoctorAppointmentScreen";
import DoctorAppointmentDetailScreen from "../../screens/doctor/Appointment/DoctorAppointmentDetailScreen";

const Stack = createStackNavigator();
export default function DoctorAppointmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DoctorAppointmentScreen"
        component={DoctorAppointmentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorAppointmentDetailScreen"
        component={DoctorAppointmentDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
