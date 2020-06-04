import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {USER} from "../actions/action_constants";



export function* logoutWatcher() {
    yield takeLatest(USER.LOGOUT.REQUEST, function* (action) {
        try {
            const result = yield call([localStorage, localStorage.removeItem], 'jwt');
            yield put({type: USER.LOGOUT.SUCCESS, result});
        } catch (error) {
            yield put({type: USER.LOGOUT.FAILURE, error});
        }

    });
}