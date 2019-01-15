import {CANVAS_OBJECT_ADDED, CANVAS_OBJECT_REMOVED} from "../actions/constants";
// import undoable from "./undoable";

const initialState = {
    objects: [],
    width: 500, //temporär
    height: 500 //temporär
};

const canvas = (state = initialState, action) => {
    switch (action.type) {
        case 'CANVAS_UPDATED':
            return {...state, objects: action.serializedCanvas};

        case CANVAS_OBJECT_ADDED:
            return {...state, objects: action.serializedCanvas};

        case CANVAS_OBJECT_REMOVED:
            return {...state, objects: action.serializedCanvas};

        case 'CANVAS_RESIZED':
            return {...state, width: action.width, height: action.height};

        default:
            return state;
    }
};

export default canvas
// export default undoable(canvas)