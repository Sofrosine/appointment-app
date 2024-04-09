import { createStackNavigator } from "@react-navigation/stack";
import CategoryScreen from "../../screens/administrator/Category";
import CategoryDetailScreen from "../../screens/administrator/Category/CategoryDetailScreen";

const Stack = createStackNavigator();
export default function CategoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryDetailScreen"
        component={CategoryDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
