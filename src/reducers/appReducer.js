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
                legalTexts: [...state.legalTexts, ...Object.entries(action.data).map(([did, title]) => {
                    return {did, title}
                })]
            }
        case APP.FRONTEND.FAILURE:
            return {
                ...state,
                error: action.statusCode === 500 ? {type: "not available", message: "backend service not available"} : null
            }
        case APP.IDB_INIT.SUCCESS:
            return {
                ...state,
                idb: true
            }
        case 'GDPR_OKAY':
            return {
                ...state,
                gdpr: true
            }
        case ERROR_THROWN:
            return {
                ...state,
                error: {
                    name: action.error.name,
                    message: action.error.message,
                    stack: action.error.stack
                }
            }
        default:
            return state;
    }
};

export default appReducer;