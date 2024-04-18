import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Button,
  View,
  BackHandler,
  ActivityIndicator,
} from "react-native";

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
} from "firebase/firestore";

import CallActionBox from "../../../components/CallActionBox";
import { dbFirestore } from "../../../../firebaseConfig";
import { CALL_TYPE } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../styles/Theme";
import { Image } from "expo-image";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function DoctorCall({ roomId, callType }) {
  const [localStream, setLocalStream] = useState<MediaStream>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream>(null);
  const [cachedLocalPC, setCachedLocalPC] = useState<RTCPeerConnection>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isOffCam, setIsOffCam] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    startLocalStream();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        endCall();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (localStream && roomId) {
      startCall(roomId);
    }
  }, [localStream, roomId]);

  //End call button
  async function endCall() {
    if (cachedLocalPC) {
      const senders = cachedLocalPC.getSenders();
      senders.forEach((sender) => {
        cachedLocalPC.removeTrack(sender);
      });
      cachedLocalPC.close();
    }

    const roomRef = doc(dbFirestore, "room", roomId);
    await updateDoc(roomRef, { answer: deleteField() });

    setLocalStream(null);
    setRemoteStream(null); // set remoteStream to null or empty when callee leaves the call
    setCachedLocalPC(null);
    // cleanup
    // setScreen(CALL_TYPE.ROOM); //go back to room screen
    navigation.goBack();
  }

  //start local webcam on your device
  const startLocalStream = async () => {
    // isFront will determine if the initial camera should face user or environment
    const isFront = true;
    const devices: any = await mediaDevices.enumerateDevices();

    const facing = isFront ? "front" : "environment";
    const videoSourceId = devices?.find(
      (device) => device.kind === "videoinput" && device.facing === facing
    );
    const facingMode = isFront ? "user" : "environment";
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  const startCall = async (id) => {
    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach((track) => {
      localPC.addTrack(track, localStream);
    });

    const roomRef = doc(dbFirestore, "room", id);
    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    localPC.addEventListener("icecandidate", (e) => {
      if (!e.candidate) {
        console.log("Got final candidate!");
        return;
      }
      addDoc(callerCandidatesCollection, e.candidate.toJSON());
    });

    localPC.addEventListener("track", (e) => {
      const newStream = new MediaStream();
      e.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    });

    const offer = await localPC.createOffer({});
    await localPC.setLocalDescription(offer);

    await setDoc(roomRef, { offer, connected: false }, { merge: true });

    // Listen for remote answer
    onSnapshot(roomRef, (doc) => {
      const data = doc.data();
      if (!localPC?.remoteDescription && data?.answer) {
        const rtcSessionDescription = new RTCSessionDescription(
          data?.answer ?? {}
        );
        localPC.setRemoteDescription(rtcSessionDescription);
      } else {
        setRemoteStream(null);
      }
    });

    // when answered, add candidate to peer connection
    onSnapshot(calleeCandidatesCollection, (snapshot) => {
      snapshot?.docChanges()?.forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    setCachedLocalPC(localPC);
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach((track) => track._switchCamera());
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleCamera = () => {
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsOffCam(!isOffCam);
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.color_gray }}>
      {!remoteStream && (
        <>
          <RTCView
            style={{ flex: 1, display: callType === "audio" ? "none" : "flex" }}
            streamURL={localStream && localStream.toURL()}
            objectFit={"cover"}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <ActivityIndicator size={40} color={colors.color_primary} />
            <Text>Waiting for patient...</Text>
          </View>
        </>
      )}

      {remoteStream && (
        <>
          <RTCView
            style={{ flex: 1, display: callType === "audio" ? "none" : "flex" }}
            streamURL={remoteStream && remoteStream.toURL()}
            objectFit={"cover"}
          />
          {!isOffCam && callType === "video" && (
            <RTCView
              //   className="w-32 h-48 absolute right-6 top-8"
              style={{
                position: "absolute",
                height: 144,
                width: 96,
                right: 24,
                top: 32,
              }}
              mirror={true}
              streamURL={localStream && localStream.toURL()}
            />
          )}
          {callType === "audio" ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <Image
                source={require("../../../../assets/user-profile.png")}
                style={{ height: 200, width: 200, borderRadius: 400 }}
              />
            </View>
          ) : (
            <View />
          )}
        </>
      )}
      <View
        style={{ position: "absolute", bottom: 0, width: "100%", zIndex: 9999 }}
      >
        <CallActionBox
          switchCamera={switchCamera}
          toggleMute={toggleMute}
          toggleCamera={toggleCamera}
          endCall={endCall}
          callType={callType}
        />
      </View>
    </View>
  );
}
