import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import BookingHistoryScreen from "../screens/BookingHistoryScreen";
import FeedBackScreen from "../screens/FeedBackScreen";
import ServiceBookingScreen from "../screens/ServiceBookingScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserInfosScreen from "../screens/UserInfosScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

import { useEffect, useState } from "react";
import { app, getAuth } from "../../firebaseConfig";
import { ROLES } from "../constants";
import { useAppSelector } from "../hooks";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import UserProfileDetailScreen from "../screens/UserProfileDetailScreen";
import SignInAdministratorScreen from "../screens/administrator/SignInAdministratorScreen";
import SignInDoctorScreen from "../screens/doctor/Auth/SignInDoctorScreen";
import iconPref from "../utils/NavBarUtils";
import AppointmentStack from "./AdminStack/AppointmentStack";
import CategoryStack from "./AdminStack/CategoryStack";
import DoctorStack from "./AdminStack/DoctorStack";
import DoctorAppointmentStack from "./DoctorStack/DoctorAppointmentStack";
import ProfileStack from "./ProfileStack";
import HomeStack from "./UserStack/HomeStack";
import SearchStack from "./UserStack/SearchStack";
import UserAppointmentStack from "./UserStack/UserAppointmentStack";
import CallScreen from "../screens/call/CallScreen";

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
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignInAdministratorScreen"
        component={SignInAdministratorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignInDoctorScreen"
        component={SignInDoctorScreen}
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
        name="UserProfileDetailScreen"
        component={UserProfileDetailScreen}
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

const Main = () => {
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
    <Tab.Navigator screenOptions={iconPref} initialRouteName="Home">
      {userData?.role === ROLES.DOCTOR ? (
        <>
          <Tab.Screen
            name="DoctorAppointments"
            component={DoctorAppointmentStack}
          />
        </>
      ) : userData?.role === ROLES.ADMIN ? (
        <>
          <Tab.Screen name="Doctor" component={DoctorStack} />
          <Tab.Screen name="Appointments" component={AppointmentStack} />
          <Tab.Screen name="Category" component={CategoryStack} />
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Search" component={SearchStack} />
          <Tab.Screen
            name="Appointments"
            component={getTabScreen(UserAppointmentStack, AuthStack)}
          />
        </>
      )}
      <Tab.Screen
        name="Profile"
        component={getTabScreen(ProfileStack, AuthStack)}
      />
    </Tab.Navigator>
  );
};

const auth = getAuth(app);

export default function Router() {
  const { data: userData } = useAppSelector((state) => state.authReducer) || {};

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={Main} />

      {(userData?.role === ROLES.DOCTOR || userData?.role === ROLES.USER) && (
        <Stack.Screen name="CallScreen" component={CallScreen} />
      )}
    </Stack.Navigator>
  );
}
