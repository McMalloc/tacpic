import {ADDRESS, CLEAR_USER, ORDER, RESET_USER_ERRORS, USER} from '../actions/action_constants';

let initialState = {
    logged_in: false,
    login_pending: false,
    addresses: [],
    error: null
};

const userApi = (state = initialState, action) => {
    switch (action.type) {
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
                login_pending: false,
                logged_in: true,
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
                email: action.payload.uname,
                login_pending: true
            };
        case USER.CREATE.SUCCESS:
            return {
                ...state,
                login_pending: false,
                logged_in: true
            };
        case USER.CREATE.FAILURE:
            return {
                ...state,
                login_pending: false,
                error: action.message
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