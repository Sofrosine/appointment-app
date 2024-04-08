// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrB9cqceMkInmonqQONUpJhINw-UuwxTY",
  authDomain: "appointment-doctor-f6f50.firebaseapp.com",
  projectId: "appointment-doctor-f6f50",
  storageBucket: "appointment-doctor-f6f50.appspot.com",
  messagingSenderId: "967013242488",
  appId: "1:967013242488:web:b1c99384aa5d4a2166ff8d",
  measurementId: "G-M3Y8P239S9",
  databaseURL:
    "https://appointment-doctor-f6f50-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const analytics = getAnalytics(app);

export { app, getAuth, analytics };
