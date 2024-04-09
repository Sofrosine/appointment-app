import {
  Mulish_300Light,
  Mulish_400Regular,
  Mulish_500Medium,
  Mulish_600SemiBold,
  Mulish_700Bold,
  Mulish_900Black,
} from "@expo-google-fonts/mulish";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React from "react";
import FlashMessage from "react-native-flash-message";
import { MenuProvider } from "react-native-popup-menu";
import { Provider } from "react-redux";
import Router from "./src/routes";
import { store } from "./src/store";

export default function App() {
  //font
  const [fontsLoaded] = useFonts({
    Mulish_300Light,
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <MenuProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Router />
          <FlashMessage position="top" />
        </NavigationContainer>
      </Provider>
    </MenuProvider>
  );
}
