
export const GENERATE_TOKEN_URL = `${process.env.REACT_APP_API_SERVICE_HOST}api/v1/misc/generate-token`;
export const HOST_URL = `http://localhost:3000`;
export const USER_SUB_ROLE_CHANGED = "USER_SUB_ROLE_CHANGED";
export const REQUEST_TO_SPEAK = "REQUEST_TO_SPEAK";

export const USER_ROLE = {
    HOST : "host",
    CO_HOST : "cohost",
    SPEAKER : "speaker",
    LISTENER : "listener"
}