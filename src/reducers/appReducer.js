import {APP} from '../actions/action_constants';

let initialState = {
    version: ''
};

const appReducer = (state = initialState, action) => {
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
        default:
            return state;
    }
};

export default appReducer