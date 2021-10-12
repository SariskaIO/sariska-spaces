import { END_SPACE, MAKE_LISTENER, MAKE_SPEAKER, REMOVE_CO_HOST, SELECT_PARTICIPANT_TYPE, SET_CO_HOST, SET_HOST, SET_SPACE_TITLE, START_SPACE } from "../actions/types"

const initialState = {
    spaceTitle: '',
    liveSpace: false,
    host: '',
    coHosts: [],
    speakers: [],
    listeners: [],
    type: {
        host: false,
        cohost: false,
        speaker: false,
        listener: false
    }
}

export const space = (state=initialState, action) => {
    switch(action.type){
        case SET_SPACE_TITLE:
            state.spaceTitle = action.payload;
            return {...state};
        case START_SPACE:
            state.liveSpace = true;
            return {...state};
        case END_SPACE:
            state.liveSpace = false;
                return {...state};
        case SET_HOST:
            if(action.payload.host){
                state.host = action.payload.participantId;
                state.type.host = true;
            }
            return {...state};
        case SET_CO_HOST:
            if(action.payload.cohost){
                state.coHosts.push(action.payload.participantId);
            }
            return {...state};
        case MAKE_SPEAKER:
            if(action.payload.speaker){
                state.speakers.push(action.payload.participantId);
                state.type.speaker = true;
            }
            return {...state};
        case MAKE_LISTENER:
            if(action.payload.listener){
                state.listeners.push(action.payload.participantId);
            }
            return {...state};
        case SELECT_PARTICIPANT_TYPE:
            state.type[action.payload.type] = action.payload.bool;
            return {...state};
        default:
            return state;
    }
}