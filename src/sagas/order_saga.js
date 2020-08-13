import {put, takeLatest, take, race} from "redux-saga/effects";
import {CLEAR_BASKET, ORDER} from "../actions/action_constants";
import createSaga from "./saga_utilities";
import {id} from "./index";

export const orderCreateSaga = createSaga(ORDER.CREATE, 'post', 'orders', takeLatest, true, id, id, ['catalogue', 'basket']);
export const orderIndexSaga = createSaga(ORDER.INDEX, 'get', 'orders', takeLatest, true, id, id);

export function* orderCompleteWatcher() {
    yield takeLatest(ORDER.CREATE.SUCCESS, function* (action) {
        yield put({
            type: CLEAR_BASKET
        });
    });
}

