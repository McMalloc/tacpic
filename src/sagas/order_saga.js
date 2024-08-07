import {put, takeLatest, take, race} from "redux-saga/effects";
import {CLEAR_BASKET, ORDER} from "../actions/action_constants";
import createSaga from "./saga_utilities";

export const orderCreateSaga = createSaga(ORDER.CREATE, 'post', 'orders', takeLatest, true, request=>request, response=>response, ['catalogue', 'basket']);
export const orderIndexSaga = createSaga(ORDER.INDEX, 'get', 'orders', takeLatest, true, request=>request, response=>response);

export function* orderCompleteWatcher() {
    yield takeLatest(ORDER.CREATE.SUCCESS, function* (action) {
        yield put({
            type: CLEAR_BASKET
        });
    });
}

