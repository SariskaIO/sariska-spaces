import {ADD_CONFERENCE, CLEAR_ALL, REMOVE_CONFERENCE, USER_ROLE_CHANGED} from "./types";

export const addConference = (conference) => {
    return {
        type: ADD_CONFERENCE,
        payload: conference
    }
}

export const removeConference = () => {
    return {
        type: REMOVE_CONFERENCE
    }
}

export const clearAllReducers = () => {
    return {
        type: CLEAR_ALL
    }
}


export const userRoleChanged = () => {
    return {
        type: USER_ROLE_CHANGED
    }
}
