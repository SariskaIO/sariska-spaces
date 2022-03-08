import {SET_PROFILE, SET_SUB_ROLE, SET_SPACE_TITLE, SET_SPACE_TYPE} from "./types"

export const setProfile = (profile) => {
    return {
        type: SET_PROFILE,
        payload: profile
    }
}

export const addSubRole = (subRole) => {
    return {
        type: SET_SUB_ROLE,
        payload: subRole
    }
}

export const addSpaceTitle = (title) => {
    return {
        type: SET_SPACE_TITLE,
        payload: title
    }
}

export const addSpaceType = (spaceType) => {
    return {
        type: SET_SPACE_TYPE,
        payload: spaceType
    }
}