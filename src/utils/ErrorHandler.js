import { showMessage } from "react-native-flash-message";

export default function (errorCode) {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address";

    case "auth/email-already-in-use":
      return "User already registered";

    case "auth/user-not-found":
      return "User not found";

    case "auth/wrong-password":
      return "Invalid password";

    case "auth/weak-password":
      return "Weak password";

    case "auth/admin-restricted-operation":
      return "Form cannot be empty";

    case "auth/missing-password":
      return "Password cannot be empty";

    case "auth/missing-email":
      return "Email cannot be empty";

    default:
      return errorCode;
  }
}

export function showTopMessage(messageText, messageType) {
  showMessage({
    message: messageText,
    type: messageType,
  });
}
