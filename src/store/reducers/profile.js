import { USER_ROLE } from "../../constants";
import { SET_PROFILE, UPDATE_PROFILE, SET_SPACE_TITLE} from "../actions/types";

const initialState = {
    name: '',
    spaceTitle: '',
    avatar: "",
    role: USER_ROLE.SPEAKER,
    id: ""
};

export const profile = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROFILE:
            const {name, avatar, id, role} = action.payload;
            state.name = name;
            state.avatar = avatar;
            state.id = id;
            state.role = role;
            return {...state};
        case UPDATE_PROFILE:
            state.name = action.payload.name;
            state.role = action.payload.role? action.payload.role : state.role;
            return {...state};
        case SET_SPACE_TITLE:
            state.spaceTitle = action.payload.spaceTitle;
            return {...state};
        default:
            return state
    }
}
