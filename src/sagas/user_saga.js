import {takeLatest, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {ADDRESS, CLEAR_USER, USER} from "../actions/action_constants";
import createSaga from "./saga_utilities";
import {id} from "./index";

export const userValidateSaga = createSaga(USER.VALIDATE, 'get', 'users/validate', takeLatest, true);

export const userCreateSaga = createSaga(USER.CREATE, 'post', 'create-account', takeLatest, false, request => {
    return {
        login: request.uname,
        "login-confirm": request.uname,
        password: request.pwd,
        "password-confirm": request.pwdConfirm,
    }
}, (response, statusCode, authHeader) => {
    localStorage.setItem('jwt', authHeader);
    return response;
});

const processLoginResponse = (response, statusCode, authHeader) => {
    localStorage.setItem('jwt', authHeader);
    if (statusCode === 200) return JSON.parse(/^\{(.*?)\}/.exec(response)[0]); // catch rodauths weird login response
}

export const userLoginSaga = createSaga(USER.LOGIN, 'post', 'login', takeLatest, false, request=>request, processLoginResponse);
export const userVerifySaga = createSaga(USER.VERIFY, 'post', 'verify-account?key=:key', takeLatest, false, id, processLoginResponse);

// TODO doesnt work
// export const userLogoutSaga = createSaga(USER.LOGIN, 'post', 'login', takeLatest, false, id, () => {
//     return call([localStorage, localStorage.removeItem], 'jwt');
// });

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