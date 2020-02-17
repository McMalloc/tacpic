import {put, takeLatest, take, race} from "redux-saga/effects";
import {FILE, VARIANT} from "../actions/constants";

export function* openFileWatcher() {
    yield takeLatest(FILE.OPEN.REQUEST, function* (action) {
        let mode = action.mode;
        yield put({
            type: VARIANT.GET.REQUEST,
            payload: {id: action.id}
        });

        const { success, failure } = yield race({
            success: take(VARIANT.GET.SUCCESS),
            failure: take(VARIANT.GET.FAILURE)
        });

        if (success) {
            yield put({
                type: FILE.OPEN.SUCCESS,
                data: success.data, mode
            });
        } else {
            yield put({
                type: FILE.OPEN.FAILURE
            });
        }
    });
}

