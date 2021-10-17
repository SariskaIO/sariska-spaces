import {CLEAR_ALL} from "../actions/types";
import {combineReducers} from "redux";
import {conference} from "./conference";
import {connection} from "./connection";
import {remoteTrack} from "./remoteTrack";
import {localTrack} from "./localTrack";
import {profile} from "./profile";
import {color} from "./color";
import {audioIndicator} from "./audioIndicator";
import { notification } from "./notification";
import { message } from "./message";
import { chat } from "./chat";
import { layout } from "./layout";
import {participant} from "./participant";

export const appReducer = combineReducers({
    conference,
    connection,
    remoteTrack,
    localTrack,
    profile,
    color,
    audioIndicator,
    notification,
    message,
    chat,
    layout,
    participant
});


export const rootReducer = (state, action) => {
    if (action.type === CLEAR_ALL) {
        const { routing } = state
        state = { routing } 
    }
    return appReducer(state, action);
}
