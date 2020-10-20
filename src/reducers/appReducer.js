import {APP, ERROR_THROWN} from '../actions/action_constants';

const appReducer = (state = {}, action) => {
    switch (action.type) {
        case APP.FRONTEND.SUCCESS:
            return {
                ...state,
                frontend: action.data
            }
        case APP.BACKEND.SUCCESS:
            return {
                ...state,
                backend: action.data
            }
        case APP.LEGAL.SUCCESS:
            return {
                ...state,
                legalTexts: Object.entries(action.data).map(([did, title]) => {
                    return {did, title}
                })
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

export default appReducer;