import { combineReducers } from 'redux'
import file from './editor_file'
import ui from './editor_ui'
import user from './userApi'
import catalogue from './catalogueApi'
import {USER} from "../actions/action_constants";

const editor = combineReducers({file, ui});

export default combineReducers({
    editor,
    catalogue,
    user
});