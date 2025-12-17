export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    TIMEOUT: 30000,
    ENDPOINTS: {
        AUTH: {
            LOGIN: "/auth/login",
            LOGOUT: "/auth/logout",
            REFRESH: "/auth/token/refresh",
            REGISTER: "/auth/register"
        },
        USER: {
            CURRENT_USER: "/api/user/current-user"
        },
        FLASHCARD: {
            TOPICS: "/api/vocabulary-topics",
            TOPIC_BY_ID: "/api/vocabulary-topics",
            ADMIN_TOPICS: "/api/admin/vocabulary-topics",
            ADMIN_VOCABULARIES: "/api/admin/vocabulary-topics"
        },
        MINIGAME: {
            ADMIN_MINI_GAMES: "/api/admin/mini-games",
            START: "/api/mini-games/start",
            SUBMIT: "/api/mini-games"
        }
    }
} as const;

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const RESET_REGISTER_SUCCESS = 'RESET_REGISTER_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAIL = 'LOAD_USER_FAIL';
export const AUTHENTICATED_SUCCESS = 'AUTHENTICATED_SUCCESS';
export const AUTHENTICATED_FAIL = 'AUTHENTICATED_FAIL';
export const REFRESH_SUCCESS = 'REFRESH_SUCCESS';
export const REFRESH_FAIL = 'REFRESH_FAIL';
export const SET_AUTH_LOADING = 'SET_AUTH_LOADING';
export const REMOVE_AUTH_LOADING = 'REMOVE_AUTH_LOADING';
