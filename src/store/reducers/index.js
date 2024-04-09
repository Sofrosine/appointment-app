import { combineReducers } from "redux";
import auth from "../slices/auth";

const appReducer = combineReducers({
  authReducer: auth,
});

export default appReducer;
