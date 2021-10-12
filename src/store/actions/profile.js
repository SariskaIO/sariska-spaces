import {SET_PROFILE, UPDATE_PROFILE} from "./types"

export const setProfile = (profile) => {
    return {
        type: SET_PROFILE,
        payload: profile
    }
}

export const updateProfile = (profile) => {
    return {
        type: UPDATE_PROFILE,
        payload: profile
    }
}
