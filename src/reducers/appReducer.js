import {APP, ERROR_THROWN} from '../actions/action_constants';

const appReducer = (state = {}, action) => {
    switch (action.type) {
        case APP.FRONTEND.SUCCESS:
            return {
                ...state,
                ...action.data
            }
        case APP.BACKEND.SUCCESS:
            return {
                ...state,
                ...action.data
            }
        case ERROR_THROWN:
            return {
                ...state,
                error: action.error
            }
        default:
            return state;
    }
};

export default appReducer