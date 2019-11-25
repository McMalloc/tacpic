import { combineReducers } from 'redux'
import file from './editor_file'
import ui from './editor_ui'
import user from './userApi'
import pages from './pagesApi'
import catalogue from './catalogueApi'
// import canvas from "./canvas";

const editor = combineReducers({file, ui});

export default combineReducers({
    editor,
    catalogue,
    // canvas,
    user,
    pages
});