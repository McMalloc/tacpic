import {put, takeLatest, take, race} from "redux-saga/effects";
import { FILE, VARIANT } from "../actions/action_constants";
import md5 from 'blueimp-md5';

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
                data: {...success.data, ...action.data}, mode
            });
            localStorage.setItem("EDITOR_LAST_SAVED_VERSION", md5(JSON.stringify(success.data)));
            localStorage.removeItem("EDITOR_BACKUP");
            localStorage.removeItem("EDITOR_BACKUP_DATE");
            localStorage.removeItem("HAS_EDITOR_CRASHED");
            yield put({type: 'CLEAR'})
        } else {
            yield put({
                type: FILE.OPEN.FAILURE
            });
        }
    });
}

