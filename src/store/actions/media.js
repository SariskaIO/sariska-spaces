import { SET_HAND_RAISE, MUTE, MUTE_ALL, SPACE_NAME } from "./types"

export const raiseHand=(toggleHand)=>{
    return {
        type: SET_HAND_RAISE,
        payload: toggleHand
    }
};
export const muteSelf=(toggleMute)=>{
    return {
        type: MUTE,
        payload: toggleMute
    }
};
export const muteAll=(toggleMuteAll)=>{
    return {
        type: MUTE_ALL,
        payload: toggleMuteAll
    }
};
export const nameSpace=(name)=>{
    return {
        type: SPACE_NAME,
        payload: name
    }
};