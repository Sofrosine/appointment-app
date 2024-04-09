import { createStackNavigator } from "@react-navigation/stack";
import DoctorScreen from "../../screens/administrator/Doctor/DoctorScreen";

const Stack = createStackNavigator();
export default function DoctorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DoctorScreen"
        component={DoctorScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
