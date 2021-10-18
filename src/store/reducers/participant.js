import {
    ADD_PARTICIPANT,
    REMOVE_PARTICIPANT,
    PARTICIPANT_PROPERTY_CHANGED,
    UPDATE_PARTICIPANT_ROLE
} from "../actions/types";

const initialState = [];

export const participant = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PARTICIPANT:
            if (!state.find(participant=>participant._id === action.payload._id)) {
                state.push(action.payload);
            }
            return [...state];
        case UPDATE_PARTICIPANT_ROLE:
            const index = state.findIndex(participant=>participant._id === action.payload.participantId);
            state[index] = {...state[index], _properties: {subRole: action.payload.role}};
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
