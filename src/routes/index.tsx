import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import BookingHistoryScreen from "../screens/BookingHistoryScreen";
import CalendarScreen from "../screens/CalendarScreen";
import FeedBackScreen from "../screens/FeedBackScreen";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SearchScreen from "../screens/SearchScreen";
import ServiceBookingScreen from "../screens/ServiceBookingScreen";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserInfosScreen from "../screens/UserInfosScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { app, getAuth } from "../../firebaseConfig";
import SignInAdministratorScreen from "../screens/administrator/SignInAdministratorScreen";
import iconPref from "../utils/NavBarUtils";
import { useAppSelector } from "../hooks";
import { ROLES } from "../constants";
import HomeStack from "./UserStack/HomeStack";
import SearchStack from "./UserStack/SearchStack";
import DoctorStack from "./AdminStack/DoctorStack";
import CategoryStack from "./AdminStack/CategoryStack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignInAdministratorScreen"
        component={SignInAdministratorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceBookingScreen"
        component={ServiceBookingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingHistoryScreen"
        component={BookingHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserInfosScreen"
        component={UserInfosScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedBackScreen"
        component={FeedBackScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const auth = getAuth(app);

export default function Router() {
  const [user, setUser] = useState(null);
  const { data: userData } = useAppSelector((state) => state.authReducer) || {};

  // check authentication
  useEffect(() => {
    auth?.onAuthStateChanged(async (user) => {
      setUser(user);
    });
  }, []);

  function getTabScreen(authenticatedComponent, defaultComponent) {
    return user ? authenticatedComponent : defaultComponent;
  }

  return (
    <>
      <Tab.Navigator screenOptions={iconPref} initialRouteName="Home">
        {userData?.role === ROLES.USER ? (
          <>
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Search" component={SearchStack} />
            <Tab.Screen
              name="Appointments"
              component={getTabScreen(CalendarScreen, AuthStack)}
            />
          </>
        ) : (
          <>
            <Tab.Screen name="Doctor" component={DoctorStack} />
            <Tab.Screen name="Category" component={CategoryStack} />
          </>
        )}
        <Tab.Screen
          name="Profile"
          component={getTabScreen(UserProfileScreen, AuthStack)}
        />
      </Tab.Navigator>
    </>
  );
}
