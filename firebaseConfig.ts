// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  initializeAuth,
  getAuth,
  // @ts-ignore
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  // apiKey: "AIzaSyCrB9cqceMkInmonqQONUpJhINw-UuwxTY",
  // authDomain: "appointment-doctor-f6f50.firebaseapp.com",
  // projectId: "appointment-doctor-f6f50",
  // storageBucket: "appointment-doctor-f6f50.appspot.com",
  // messagingSenderId: "967013242488",
  // appId: "1:967013242488:web:b1c99384aa5d4a2166ff8d",
  // measurementId: "G-M3Y8P239S9",
  // databaseURL:
  //   "https://appointment-doctor-f6f50-default-rtdb.asia-southeast1.firebasedatabase.app",
  // apiKey: "AIzaSyBj2ocEcAhiNeYDB4b8xjz4mY1CyPsmYsM",
  // authDomain: "amc-doctor-b4b07.firebaseapp.com",
  // projectId: "amc-doctor-b4b07",
  // storageBucket: "amc-doctor-b4b07.appspot.com",
  // messagingSenderId: "441320752863",
  // appId: "1:441320752863:web:c9e1cf932539da6b364b6a",
  // measurementId: "G-KH6P7R58BV",
  // databaseURL:
  //   "https://amc-doctor-b4b07-default-rtdb.asia-southeast1.firebasedatabase.app/",

  apiKey: "AIzaSyB6YMCn9hwE8nS-DrgVgqB9njU5yAsM8dc",
  authDomain: "booking-app-67479.firebaseapp.com",
  projectId: "booking-app-67479",
  storageBucket: "booking-app-67479.appspot.com",
  messagingSenderId: "1080537463144",
  appId: "1:1080537463144:web:49ee4cd882d1b836db3edd",
  measurementId: "G-6YNDZCBZC7",
  databaseURL: "https://booking-app-67479-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const analytics = getAnalytics(app);

export { app, getAuth, analytics };
