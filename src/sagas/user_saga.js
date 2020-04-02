import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {USER} from "../actions/constants";

// export function* loginWatcher() {
//     yield takeLatest(USER.LOGIN.REQUEST, loginWorker);
// }
//
// function loginUser(action) {
//     // return fetch('http://localhost:9292/login');
//     return axios.post('http://localhost:9292/login', {
//         login: action.username,
//         password: action.password
//     }, {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// }
//
// function* loginWorker(action) {
//     try {
//         const response = yield call(loginUser, action);
//         if (response.status === 200) {
//             localStorage.setItem('jwt', response.headers.authorization);
//             yield put({
//                 type: USER.LOGIN.SUCCESS,
//                 data: JSON.parse(response.data.substring(0, response.data.length - 2)) // weird behaviour in Roda; appends {} at the end of the body
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         yield put({type: USER.LOGIN.FAILURE});
//     }
// }

// export function* createWatcher() {
//     yield takeLatest(USER.CREATE.REQUEST, createWorker);
// }
//
// function createUser(action) {
//     // return fetch('http://localhost:9292/login');
//     return axios.post('/create-account', {
//         login: action.username,
//         "login-confirm": action.username,
//         password: action.password,
//         "password-confirm": action.password,
//     }, {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// }
//
// function* createWorker(action) {
//     try {
//         const response = yield call(createUser, action);
//         if (response.status === 200) {
//             localStorage.setItem('jwt', response.headers.authorization);
//             yield put({
//                 type: USER.CREATE.SUCCESS,
//                 user: JSON.parse(response.data.substring(0, response.data.length - 2)) // weird behaviour in Roda; appends {} at the end of the body
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         yield put({type: USER.CREATE.FAILURE});
//     }
// }

export function* saveUserLayoutWatcher() {
    yield takeLatest(USER.SAVE_LAYOUT.REQUEST, saveLayoutWorker);
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