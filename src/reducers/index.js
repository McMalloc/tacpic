import { combineReducers } from 'redux'
import editor from './editor'
import user from './userApi'
import pages from './pagesApi'

export default combineReducers({
    editor,
    user,
    pages
});