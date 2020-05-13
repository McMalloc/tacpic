import { combineReducers } from 'redux'
import file from './editor_file'
import ui from './editor_ui'
import user from './userApi'
import catalogue from './catalogueApi'
import {USER} from "../actions/constants";

const editor = combineReducers({file, ui});

export default combineReducers({
    editor,
    catalogue,
    user,
    meta: (state = {backend_version: null}, action) => {
        switch (action.type) {
            case USER.VALIDATE.FAILURE:
            case USER.VALIDATE.SUCCESS:
                return {
                    ...state,
                    backendVersion: action.data.backend_version
                };
            default: return state;
        }}
});