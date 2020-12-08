import { combineReducers } from 'redux'
import file from './editor_file'
import ui from './editor_ui'
import user from './userApi'
import catalogue from './catalogueApi'
import app from "./appReducer";
import undoable from "./undoable";

const editor = combineReducers({file: undoable(file), ui});

// router state für COnnectedRouter, derzeit inkompatibel zu React-Router
const createRootReducer = (history) => combineReducers({
    // router: connectRouter(history),
    editor,
    catalogue,
    user,
    app
})
export default createRootReducer;