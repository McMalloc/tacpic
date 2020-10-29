import {ADDRESS, ORDER, RESET_USER_ERRORS, USER} from '../actions/action_constants';

const userApi = (state = {}, action) => {
    switch (action.type) {
        case USER.VERIFY.REQUEST:
            return {...state,
                verification_state: 2
            };
        case USER.VERIFY.SUCCESS:
            return {...state,
                verification_state: 3,
                email: action.data.email,
                id: action.data.id,
                logged_in: true
            };
        case USER.VERIFY.FAILURE:
            return {...state,
                error: action.message
            };

        case USER.RESET_REQUEST.REQUEST:
            return {...state,
                reset_state: 0,
                email: action.payload.email
            };
        case USER.RESET_REQUEST.SUCCESS:
            return {...state,
                reset_state: 1
            };
        case USER.RESET_REQUEST.FAILURE:
            return {...state,
                reset_state: -1,
                error: action.message
            };

        case USER.RESET.REQUEST:
            return {...state,
                reset_state: 2,
                email: action.payload.email
            };
        case USER.RESET.SUCCESS:
            return {...state,
                reset_state: 3
            };
        case USER.RESET.FAILURE:
            return {...state,
                reset_state: -1,
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
                displayName: action.data.display_name,
                newsletterActive: action.data.newsletter_active
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

        case USER.UPDATE.REQUEST:
            return {...state};
        case USER.UPDATE.SUCCESS:
            return {...state,
                newsletterActive: action.data.newsletter_active
            };
        case USER.UPDATE.FAILURE:
            return {...state,
                error: action.message
            };
        default:
            return state;
    }
};

export default userApi