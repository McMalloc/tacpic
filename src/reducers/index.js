import { combineReducers } from 'redux'
import editor from './editor'
import user from './userApi'
import pages from './pagesApi'
// import canvas from "./canvas";

export default combineReducers({
    editor,
    // canvas,
    user,
    pages
});