import { END_SPACE, MAKE_LISTENER, MAKE_SPEAKER, SELECT_PARTICIPANT_TYPE, SET_CO_HOST, SET_HOST, SET_SPACE_TITLE, START_SPACE } from "./types"

export const setSpace = (spaceTitle) => {
    return {
        type: SET_SPACE_TITLE,
        payload: spaceTitle
    }
}
export const startSpace = () => {
    return {
        type: START_SPACE
    }
}
export const endSpace = () => {
    return {
        type: END_SPACE
    }
}

export const setHost = (payload) => {
    return {
        type: SET_HOST,
        payload
    }
}

export const setCoHosts = (payload) => {
    return {
        type: SET_CO_HOST,
        payload
    }
}

export const makeSpeakers = (payload) => {
    return {
        type: MAKE_SPEAKER,
        payload
    }
}

export const makeListeners = (payload) => {
    return {
        type: MAKE_LISTENER,
        payload
    }
}

export const selectParticipantType = ({type, bool}) => {
    return {
        type: SELECT_PARTICIPANT_TYPE,
        payload: {type: type, bool: bool}
    }
}