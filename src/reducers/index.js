import { combineReducers } from 'redux'
import file from './editor_file'
import ui from './editor_ui'
import user from './userApi'
import pages from './pagesApi'
import catalogue from './catalogueApi'
// import canvas from "./canvas";

const editor = combineReducers({file, ui});

// export const createReducer = (ressource, reducerCallbacks) => {
//     reducerCallbacks[ressource.REQUEST] = state =>{
//             return {
//                 ...state,
//                 [ressource]: 'pending'
//             }
//         };
//     reducerCallbacks[ressource.SUCCESS] = (state, action) =>{
//             return {
//                 ...state,
//                 [ressource + '_STATE']: 'succeeded',
//                 [ressource]: action.data
//             }
//         };
//     reducerCallbacks[ressource.SUCCESS] = state =>{
//             return {
//                 ...state,
//                 [ressource + '_STATE']: 'failed'
//             }
//         };
// };

export default combineReducers({
    editor,
    catalogue,
    // canvas,
    user,
    // pages
});