import { createStore } from "redux";
import { combineReducers } from "redux";
// importing reducers
import User_Login_Updater from "./reducers/userInfo";

// -- this will combine all reducers in one
const rootReducer = combineReducers({
    User_Login_Updater
    // more reducers go here
});

let store = createStore(rootReducer);

export default store; // to main index,js
