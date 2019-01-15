import {USER} from '../actions/constants';

let initialState = {
    user: {
        logged_in: false,
        login_pending: false,
        error: null
    },
    pages: {

    }
};

const userApi = (state = initialState, action) => {
    switch (action.type) {
        case USER.LOGIN.REQUEST:
            return {
                ...state, user:
                    {
                        login_pending: true
                    }
            };
        case USER.LOGIN.SUCCESS:
            return {
                ...state, user:
                    {
                        login_pending: false,
                        logged_in: true
                    }
            };
        case USER.LOGIN.FAILURE:
            return {
                ...state, user:
                    {
                        login_pending: false,
                        logged_in: false,
                        error: action.error
                    }
            };
        case USER.SAVE_LAYOUT.REQUEST:
            return {...state};
        default:
            return state;
    }
};

export default userApi