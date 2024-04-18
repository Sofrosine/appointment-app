//RoomScreen.js

import React, { useEffect } from "react";
import { Alert, Text, View } from "react-native";

import { doc, getDoc } from "firebase/firestore";
import { dbFirestore } from "../../../../firebaseConfig";

import InputBar from "../../../components/InputBar";
import Button from "../../../components/Button";

export default function DoctorCallRoom({
  setScreen,
  screens,
  setRoomId,
  roomId,
}) {
  const onCallOrJoin = (screen) => {
    if (roomId.length > 0) {
      setScreen(screen);
    }
  };

  //generate random room id
  useEffect(() => {
    const generateRandomId = () => {
      const characters = "abcdefghijklmnopqrstuvwxyz";
      let result = "";
      for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      return setRoomId(result);
    };
    generateRandomId();
  }, []);

  //checks if room is existing
  const checkMeeting = async () => {
    if (roomId) {
      const roomRef = doc(dbFirestore, "room", roomId);
      const roomSnapshot = await getDoc(roomRef);

      // console.log(roomSnapshot.data());
      if (!roomSnapshot.exists() || roomId === "") {
        // console.log(`Room ${roomId} does not exist.`);
        Alert.alert("Wait for your instructor to start the meeting.");
        return;
      } else {
        onCallOrJoin(screens.JOIN);
      }
    } else {
      Alert.alert("Provide a valid Room ID.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ textAlign: "center" }}>Enter Room ID:</Text>
      {/* <TextInput
        className="bg-white border-sky-600 border-2 mx-5 my-3 p-2 rounded-md"
        value={roomId}
        onChangeText={setRoomId}
      /> */}
      <InputBar value={roomId} onChangeText={setRoomId} />
      <View style={{ gap: 3, marginHorizontal: 5, marginTop: 2 }}>
        <Button
          text="Start Meeting"
          theme="primary"
          onPress={() => onCallOrJoin(screens.CALL)}
        ></Button>
        <Button
          text="Join Meeting"
          theme="primary"
          onPress={() => checkMeeting()}
        ></Button>
        {/* <TouchableOpacity
          className="bg-sky-300 p-2 rounded-md"
          onPress={() => checkMeeting()}
        >
          <Text className="color-black text-center text-xl font-bold ">
            Join meeting
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
