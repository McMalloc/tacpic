import {LOCALFILES} from "../actions/action_constants";

// TODO Monster-Reducer refaktorisieren

const localfiles = (state = {}, action) => {
    switch (action.type) {
        case LOCALFILES.INDEX.SUCCESS:
            return { ...state, index: action.index };
        default: return state;
    }
};

export default localfiles