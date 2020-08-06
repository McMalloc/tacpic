import {ADDRESS, CLEAR_USER, ORDER, RESET_USER_ERRORS, USER} from '../actions/action_constants';

let initialState = {
    logged_in: false,
    login_pending: false,

    // 0: waiting for the server to initialise created account
    // 1: waiting for user to click on link and enter password
    // 2: waiting for server to finalise account
    // 3: verified account
    verification_state: -1,
    addresses: [],
    error: null
};

const userApi = (state = initialState, action) => {
    switch (action.type) {
        case USER.VERIFY.REQUEST:
            return {
                ...state,
                verification_state: 2
            };
        case USER.VERIFY.SUCCESS:
            return {
                ...state,
                verification_state: 3,
                email: action.data.email,
                id: action.data.id,
                logged_in: true
            };
        case USER.VERIFY.FAILURE:
            return {
                ...state,
                error: action.message
            };

        case USER.VALIDATE.REQUEST:
            return {
                ...state,
                login_pending: true
            };
        case USER.LOGIN.REQUEST:
            return {
                ...state,
                email: action.payload.login,
                login_pending: true
            };
        case USER.VALIDATE.SUCCESS:
        case USER.LOGIN.SUCCESS:
            return {
                ...state,
                verification_state: 3,
                logged_in: true,
                login_pending: false,
                email: action.data.email,
                id: action.data.id,
                displayName: action.data.display_name
            };
        case USER.VALIDATE.FAILURE:
            return {
                ...state,
                login_pending: false,
                logged_in: false
            };
        case USER.LOGIN.FAILURE:
            return {
                ...state,
                login_pending: false,
                logged_in: false,
                error: action.message
            };
        case USER.CREATE.REQUEST:
            return {
                ...state,
                verification_state: 0,
                email: action.payload.uname
            };
        case USER.CREATE.SUCCESS:
            return {
                ...state,
                verification_state: 1
            };
        case USER.CREATE.FAILURE:
            return {
                ...state,
                verification_state: -1,
                error: action.message.error || action.message['field-error'] || null
            };
        case USER.LOGOUT.REQUEST: return {...state};
        case USER.LOGOUT.SUCCESS:
            return {...state, logged_in: false, addresses: [], email: null, displayName: null, id: null};
        case RESET_USER_ERRORS:
            return {...state, error: null};
        case ADDRESS.GET.SUCCESS:
            return {...state,
                addresses: action.data
            };
        case ORDER.INDEX.SUCCESS:
            return {...state,
                orders: action.data
            };
        default:
            return state;
    }
};

export default userApi