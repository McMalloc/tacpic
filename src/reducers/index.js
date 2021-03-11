import { combineReducers } from 'redux'
import file from './editor_file'
import ui from './editor_ui'
import localfiles from './localfilesReducer'
import user from './userApi'
import catalogue from './catalogueApi'
import app from "./appReducer";
import cms from "./cmsReducer";
import undoable from "./undoable";
import admin from "./adminReducer";

const editor = combineReducers({file: undoable(file), ui, localfiles: localfiles});

// router state für COnnectedRouter, derzeit inkompatibel zu React-Router
const createRootReducer = () => combineReducers({
    editor,
    catalogue,
    user,
    cms,
    app,
    admin
})
export default createRootReducer;