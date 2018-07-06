import { combineReducers } from 'redux'
import editor from './editor'
import api from './api'

export default combineReducers({
    editor,
    api
});