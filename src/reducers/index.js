import { combineReducers } from 'redux'
import file from './editor_file'
import ui from './editor_ui'
import user from './userApi'
import catalogue from './catalogueApi'
import app from "./appReducer";
import undoable from "./undoable";

const editor = combineReducers({file: undoable(file), ui});

export default combineReducers({
    editor,
    catalogue,
    user,
    app
});