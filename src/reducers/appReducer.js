import {APP} from '../actions/action_constants';

let initialState = {
    version: ''
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case APP.VERSION.SUCCESS:
            return {
                version: state.version + action.data
            }
        default:
            return state;
    }
};

export default appReducer