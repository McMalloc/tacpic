import {takeLatest, call, put} from 'redux-saga/effects';
import {USER} from "../actions/action_constants";
import createSaga from "./saga_utilities";

export const userValidateSaga = createSaga(USER.VALIDATE, 'get', 'users/validate', takeLatest, true);

export const userCreateSaga = createSaga(USER.CREATE, 'post', 'create-account', takeLatest, false, request => {
    return {
        login: request.uname,
        "login-confirm": request.uname,
        password: request.pwd,
        display_name: request.displayname,
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

export const userLoginSaga = createSaga(USER.LOGIN, 'post', 'login', takeLatest, false, request=>request, processLoginResponse, null, '/catalogue');
export const userVerifySaga = createSaga(USER.VERIFY, 'post', 'verify-account?key=:key', takeLatest, false, request=>request, processLoginResponse);
export const userResetRequestSaga = createSaga(USER.RESET_REQUEST, 'post', 'reset-password-request', takeLatest, false, request=>request, response=>response);
export const userResetSaga = createSaga(USER.RESET, 'post', 'reset-password', takeLatest, false, request=>request, response=>response);

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