import {takeLatest, take, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {ADDRESS, USER} from "../actions/action_constants";
import createSaga from "./saga_utilities";

export const addressRemoveSaga = function* () {
    yield takeLatest([ADDRESS.REMOVE.SUCCESS, USER.LOGIN.SUCCESS], function* (action) {
        yield put({type: ADDRESS.GET.REQUEST});
    });
}