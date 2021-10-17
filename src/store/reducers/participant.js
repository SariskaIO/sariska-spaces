import {
    ADD_PARTICIPANT,
    REMOVE_PARTICIPANT,
    PARTICIPANT_PROPERTY_CHANGED
} from "../actions/types";

const initialState = [];

export const participant = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PARTICIPANT:
            state.push(action.payload);
            return [...state];
        case REMOVE_PARTICIPANT:
            state = state.filter(participant=>participant._id !== action.payload);
            return [...state];
        case PARTICIPANT_PROPERTY_CHANGED:
            return [...state];
        default:
            return state;
    }
};
