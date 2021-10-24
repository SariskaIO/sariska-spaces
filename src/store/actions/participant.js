import * as Constants from "./types";

export const addParticipant = (participant) => {
    return {
        type: Constants.ADD_PARTICIPANT,
        payload: participant
    }
}


export const removeParticipant = (id) => {
    return {
        type: Constants.REMOVE_PARTICIPANT,
        payload: id
    }
}


export const participantPropertyChanged = () => {
    return {
        type: Constants.PARTICIPANT_PROPERTY_CHANGED
    }
}


export const updateLocalParticipantSubRole = (payload) => {
    return {
        type: Constants.UPDATE_LOCAL_PARTICIPANT_SUB_ROLE,
        payload
    }
}







