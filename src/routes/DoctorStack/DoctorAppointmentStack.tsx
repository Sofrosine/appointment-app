import { createStackNavigator } from "@react-navigation/stack";
import DoctorAppointmentDetailScreen from "../../screens/doctor/Appointment/DoctorAppointmentDetailScreen";
import DoctorAppointmentScreen from "../../screens/doctor/Appointment/DoctorAppointmentScreen";

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
