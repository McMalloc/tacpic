import {USER} from '../actions/constants';

let initialState = {
    logged_in: false,
    login_pending: false,
    error: {}
};

const userApi = (state = initialState, action) => {
    switch (action.type) {
        case USER.VALIDATE.REQUEST:
        case USER.LOGIN.REQUEST:
            return {
                ...state,
                login_pending: true
            };
        case USER.VALIDATE.SUCCESS:
        case USER.LOGIN.SUCCESS:
            return {
                ...state,
                login_pending: false,
                logged_in: true,
                // email: action.user.email,
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
        case USER.SAVE_LAYOUT.REQUEST:
            console.log(action.layout);
            return {...state};
        default:
            return state;
    }
};

export default userApi