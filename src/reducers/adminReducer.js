import { APP, USER } from '../actions/action_constants';
import { admin } from '../store/initialState';
import createReducer from './createReducer';

const reducerMapping = {
    [USER.INDEX.SUCCESS]: (prevState, action) => ({ users: action.data })
}

export default createReducer(admin, reducerMapping)