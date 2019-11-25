import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {USER} from "../actions/constants";

export function* loginWatcher() {
    yield takeLatest(USER.LOGIN.REQUEST, loginWorker);
}

export function* saveUserLayoutWatcher() {
    yield takeLatest(USER.SAVE_LAYOUT.REQUEST, saveLayoutWorker);
}

function loginUser(action) {
    return axios({
        method: 'post',
        url: 'http://localhost:9292/login',
        data: {
            login: action.payload.unameField.value,
            password: action.payload.pwdField.value
        }
    });
}

function* loginWorker(action) {
    try {
        const response = yield call(loginUser, action);
        if (response.status === 200) {
            localStorage.setItem('jwt', response.headers.authorization);
            yield put({type: USER.LOGIN.SUCCESS});
        }
    } catch (error) {
        yield put({type: USER.LOGIN.FAILURE});
    }
}

function saveUserLayout(action) {
    return axios({
        method: 'post',
        url: '/user/layout',
        // url: 'http://localhost:9292/user/layout',
        data: {
            layout: action.layout
        },
        headers: {
            'Accept': 'application/json',
            'AUTHORIZATION': 'Bearer ' + localStorage.getItem('jwt')
        }
    });
}

function* saveLayoutWorker(action) {
    try {
        // const response = yield call(() => {}, action);
        const response = yield call(saveUserLayout, action);
        yield put({type: USER.SAVE_LAYOUT.SUCCESS, data: response.data});
    } catch (error) {
        console.error(error);
        yield put({type: USER.SAVE_LAYOUT.FAILURE});
    }
}