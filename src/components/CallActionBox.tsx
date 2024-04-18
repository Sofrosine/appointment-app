import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/Theme";

const CallActionBox = ({ switchCamera, toggleMute, toggleCamera, endCall }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const onToggleCamera = () => {
    toggleCamera();
    setIsCameraOn(!isCameraOn);
  };
  const onToggleMicrophone = () => {
    toggleMute();
    setIsMicOn(!isMicOn);
  };

  return (
    <View
      // className="border-2 border-gray-800 bg-gray-800 rounded-t-3xl p-5 pb-10 w-full flex-row justify-between"
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginBottom: 16,
      }}
    >
      <Pressable
        onPress={switchCamera}
        // className="bg-gray-600 p-3 rounded-full"
        style={{ borderRadius: 100, padding: 12, backgroundColor: colors.color_gray}}
      >
        <Text>
          <MaterialIcons name={"flip-camera-ios"} size={35} color={"white"} />
        </Text>
      </Pressable>
      <Pressable
        onPress={onToggleCamera}
        // className="bg-gray-600 p-3 rounded-full"
        style={{ borderRadius: 100, padding: 12, backgroundColor: colors.color_gray}}
      >
        <Text>
          <MaterialIcons
            name={isCameraOn ? "videocam" : "videocam-off"}
            size={35}
            color={"white"}
          />
        </Text>
      </Pressable>
      <Pressable
        onPress={onToggleMicrophone}
        // className="bg-gray-600 p-3 rounded-full"
        style={{ borderRadius: 100, padding: 12, backgroundColor: colors.color_gray}}
      >
        <Text>
          <MaterialIcons
            name={isMicOn ? "mic" : "mic-off"}
            size={35}
            color={"white"}
          />
        </Text>
      </Pressable>
      <Pressable
        onPress={endCall}
        style={{ borderRadius: 100, padding: 12, backgroundColor: 'red'}}
      >
        <Text>
          <MaterialIcons name={"call"} size={35} color={"white"} />
        </Text>
      </Pressable>
    </View>
  );
};

export default CallActionBox;
