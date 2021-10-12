import {CLEAR_ALL} from "../actions/types";
import {combineReducers} from "redux";
import {conference} from "./conference";
import {connection} from "./connection";
import {remoteTrack} from "./remoteTrack";
import {localTrack} from "./localTrack";
import {profile} from "./profile";
import {media} from "./media";
import {color} from "./color";
import {audioIndicator} from "./audioIndicator";
import { notification } from "./notification";
import { message } from "./message";
import { chat } from "./chat";
import { layout } from "./layout";
import {space} from "./space";

export const appReducer = combineReducers({
    conference,
    connection,
    remoteTrack,
    localTrack,
    profile,
    media,
    color,
    audioIndicator,
    notification,
    message,
    chat,
    layout,
    space
});

export const rootReducer = (state, action) => {
    if (action.type === CLEAR_ALL) {
        return appReducer({
            localTrack: [],
            remoteTrack: {},
            profile: state.profile
        }, action);
    }
    return appReducer(state, action);
}
