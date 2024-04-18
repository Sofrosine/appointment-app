import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import RoomCall from "./fragments/RoomCall";
import Call from "./fragments/Call";
import JoinCall from "./fragments/JoinCall";

const CallScreen = () => {
  const screens = {
    ROOM: "JOIN_ROOM",
    CALL: "CALL",
    JOIN: "JOIN",
  };

  const [screen, setScreen] = useState(screens.ROOM);
  const [roomId, setRoomId] = useState("");

  let content;

  switch (screen) {
    case screens.ROOM:
      content = (
        <RoomCall
          roomId={roomId}
          setRoomId={setRoomId}
          screens={screens}
          setScreen={setScreen}
        />
      );
      break;

    case screens.CALL:
      content = (
        <Call roomId={roomId} screens={screens} setScreen={setScreen} />
      );
      break;

    case screens.JOIN:
      content = (
        <JoinCall roomId={roomId} screens={screens} setScreen={setScreen} />
      );
      break;

    default:
      content = <Text>Wrong Screen</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      {content}
    </SafeAreaView>
  );
};

export default CallScreen;

const styles = StyleSheet.create({});
