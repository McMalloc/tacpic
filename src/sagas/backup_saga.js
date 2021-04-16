import { select, throttle, call, put, takeLatest } from "redux-saga/effects";
import { BACKUP_INTERVAL } from "../config/constants";
import { CHANGE_FILE_PROPERTY, LOCALFILES, VARIANT, GRAPHIC } from "../actions/action_constants";
import { idbWrite, idbRemove, idbIndex } from "./idb_saga";

// TODO pauschal auch Durchführen vor dem Speichern


export function* backupWatcher() {
    yield throttle(BACKUP_INTERVAL, ['OBJECT_PROP_CHANGED', 'OBJECT_UPDATED', 'OBJECT_REMOVED', 'UNDO', 'REDO', CHANGE_FILE_PROPERTY], function* (action) {
        try {
            document.getElementById("save-indicator").style.visibility = 'visible';
            let file = yield select(state => state.editor.file.present);
        
            if (file.hasOwnProperty('uuid') && file.uuid !== null) {
                yield idbWrite('files', { ...file, lastSaved: new Date() })
            }

            setTimeout(() => {
                    const elem = document.getElementById("save-indicator");
                    if (!!elem) document.getElementById("save-indicator").style.visibility = 'hidden'
                }, 750);

        } catch (error) {
            console.error(error);
        }
    })
}

export function* backupAutoRemoveWatcher() {
    yield takeLatest([VARIANT.CREATE.SUCCESS, VARIANT.UPDATE.SUCCESS, GRAPHIC.CREATE.SUCCESS], function* (action) {
        yield put({
            type: LOCALFILES.REMOVE.REQUEST,
            uuid: action.originalPayload.uuid
        })
    });
}

export function* backupIndexWatcher() {
    yield takeLatest(LOCALFILES.INDEX.REQUEST, function* () {
        const index = yield idbIndex('files');
        yield put({
            type: LOCALFILES.INDEX.SUCCESS,
            index
        })
    });
}

export function* backupRemoveWatcher() {
    yield takeLatest(LOCALFILES.REMOVE.REQUEST, function* (action) {
        try {
            yield idbRemove('files', action.uuid);
            yield put({ type: LOCALFILES.REMOVE.SUCCESS })
            yield put({ type: LOCALFILES.INDEX.REQUEST })
        } catch (error) {
            yield put({
                type: LOCALFILES.REMOVE.FAILURE,
                error
            })
        }
    });
}