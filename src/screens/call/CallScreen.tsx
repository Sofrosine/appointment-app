import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import RoomCall from "./fragments/RoomCall";
import Call from "./fragments/Call";
import JoinCall from "./fragments/JoinCall";
import { colors } from "../../styles/Theme";
import { CALL_TYPE } from "../../constants";

const CallScreen = ({ route }) => {
  const { type, roomId, callType, pairData } = route.params || {};

  let content;

  switch (type) {
    // case screens.ROOM:
    //   content = (
    //     <RoomCall
    //       roomId={roomId}
    //       setRoomId={setRoomId}
    //       screens={screens}
    //       setScreen={setScreen}
    //     />
    //   );
    //   break;

    case CALL_TYPE.CALL:
      content = <Call roomId={roomId} callType={callType} />;
      break;

    case CALL_TYPE.JOIN:
      content = <JoinCall pairData={pairData} roomId={roomId} callType={callType} />;
      break;

    default:
      content = (
        <View style={{ alignItems: "center" }}>
          <ActivityIndicator color={colors.color_primary} />
        </View>
      );
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      {content}
    </SafeAreaView>
  );
};

export default CallScreen;

const styles = StyleSheet.create({});
