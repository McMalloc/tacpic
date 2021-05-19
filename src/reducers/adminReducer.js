import { USER, ADMIN, ORDER_ADMIN } from '../actions/action_constants';
import { admin } from '../store/initialState';
import createReducer from './createReducer';

const reducerMapping = {
    [USER.INDEX.SUCCESS]: (prevState, action) => ({ ...prevState, users: action.data }),
    [ADMIN.BACKEND_ERRORS.SUCCESS]: (prevState, action) => ({ ...prevState, backendErrors: action.data }),
    [ADMIN.FRONTEND_ERRORS.SUCCESS]: (prevState, action) => ({ ...prevState, frontendErrors: action.data }),
    [ORDER_ADMIN.INDEX.SUCCESS]: (prevState, action) => ({ ...prevState, orders: action.data })
}

export default createReducer(admin, reducerMapping)