import { createStackNavigator } from "@react-navigation/stack";
import UserProfileScreen from "../screens/UserProfileScreen";
import UserProfileDetailScreen from "../screens/UserProfileDetailScreen";

const Stack = createStackNavigator();
export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfileDetailScreen"
        component={UserProfileDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
