import { createStackNavigator } from "@react-navigation/stack";
import DoctorScreen from "../../screens/administrator/Doctor/DoctorScreen";
import DoctorDetailScreen from "../../screens/administrator/Doctor/DoctorDetailScreen";
import DoctorInfoScreen from "../../screens/administrator/Doctor/DoctorInfoScreen";
import AdminDoctorAppointmentScreen from "../../screens/administrator/Doctor/AdminDoctorAppointmentScreen";

const Stack = createStackNavigator();
export default function DoctorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DoctorScreen"
        component={DoctorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorDetailScreen"
        component={DoctorDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorInfoScreen"
        component={DoctorInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDoctorAppointmentScreen"
        component={AdminDoctorAppointmentScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
