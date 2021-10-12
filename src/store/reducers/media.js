import { SET_HAND_RAISE, MUTE, MUTE_ALL, SPACE_NAME } from "../actions/types";

const initialState = {
    handRaise: false,
    mute: false,
    muteAll: false,
    spaceName: ''
}

export const media = (state = initialState, action)=>{
    switch(action.type){
        case SET_HAND_RAISE:
            state.handRaise = action.payload
            return {...state};
        case MUTE:
            state.mute = action.payload
            return {...state};
        case MUTE_ALL:
            state.muteAll = action.payload
            return {...state};
        case SPACE_NAME:
            state.spaceName = action.payload
            return {...state};
        default:
            return state;
    }
}