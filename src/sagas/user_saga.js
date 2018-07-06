import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import {USER} from "../actions/constants";

export default function* loginWatcher() {
    yield takeLatest(USER.LOGIN.REQUEST, loginWorker);
}

function loginUser(action) {
    return axios({
        method: 'post',
        url: 'http://localhost/wordpress/wp-json/jwt-auth/v1/token',
        data: {
            username: action.payload.unameField.value,
            password: action.payload.pwdField.value
        }
    });
}

function* loginWorker(action) {
    try {
        const response = yield call(loginUser, action);
        const user = response.data;
        localStorage.setItem('jwt', user.token);
        yield put({ type: USER.LOGIN.SUCCESS, user });

    } catch (error) {
        yield put({ type: USER.LOGIN.FAILURE, error });
    }
}