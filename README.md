# Online Appointment Application for Mobile Devices

The Online Appointment Application aims to address the inefficiencies in appointment processes by making scheduling and managing appointments with service providers easier. Designed to minimize the time waste and congested phone traffic caused by traditional phone-based communication, the project seeks to digitize modern appointment processes. Users can view service provider working hours, make appointments, track past appointments, and manage them, redefining productivity in appointment scheduling.

![AppUI](/assets/appUI.jpg)

![Gif](https://github.com/zhrgns/appointmentAppwithReactNative/blob/main/assets/appGif.gif)

## Technologies Used:

- Backend: Firebase Realtime Database, Firebase Authentication with Firebase JS SDK, WebRTC

- Frontend: React Native, Expo, Expo Go App, React Navigation

- Installed Packages: Expo Vector Icons, Expo Notifications, React Native Flash Message, React Native Popup Menu, Formik, Moment, Expo-Image Picker, React Native Reanimated, React Native Maps, Expo Location, React Native Share

## Key Features in the Project:

- Video & Audio Call

- Categorized list of services with detailed provider information

- Real-time availability status for booking appointments

- Notifications, view of upcoming and past appointments

- GPS integration for locating nearby services

- Share services with others.

## Requirements and Installation:

# 1. Install Package Requirement

- Ensure Node.js and Expo CLI are installed.
- Open the terminal in the project folder and run `yarn install` to install dependencies.
- Create a Firebase account and add the Firebase configuration to the project.

# 2. Install EAS CLI

## If you already have APK Dev from your developer, you can `skip` steps number 1-4 and directly start from 5th step

1.  Run `npm install -g eas-cli`
2.  Run `npx expo install expo-dev-client`
3.  Run `eas login` and login with same credential with user where your project belongs
4.  Run `eas build --profile development --platform android` to build the development APK into your Expo
5.  Go to the Expo website and log in to view your build. Wait for it to finish. Once it’s finished, you will need to install it on your Android device and run the following command in your local PC terminal: `npx expo start --dev-client`

---
