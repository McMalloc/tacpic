import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';

export function* patternsWatcher() {
    yield takeLatest(USER.LOGIN.REQUEST, patternsWorker);
}

function loadPatterns(action) {
    return axios({
        method: 'post',
        url: 'http://localhost/wordpress/wp-json/jwt-auth/v1/token',
        data: {
            username: action.payload.unameField.value,
            password: action.payload.pwdField.value
        }
    });
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

function* patternsWorker(action) {
    try {
        const response = yield call(loginUser, action);
        const user = response.data;
        localStorage.setItem('jwt', user.token);
        localStorage.setItem('user_id', user.user_id);
        yield put({type: USER.LOGIN.SUCCESS, user});
    } catch (error) {
        yield put({type: USER.LOGIN.FAILURE, error});
    }
}