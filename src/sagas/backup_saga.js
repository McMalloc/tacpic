import {put, select, debounce, throttle} from "redux-saga/effects";
import {BACKUP_INTERVAL} from "../config/constants";
import {takeLatest} from "redux-saga/dist/redux-saga-effects-npm-proxy.esm";
import {GRAPHIC, SUPPRESS_BACKUP, VARIANT, CHANGE_FILE_PROPERTY} from "../actions/action_constants";
import md5 from 'blueimp-md5';

// TODO pauschal auch Durchführen vor dem Speichern
export function* backupWatcher() {
    yield throttle(BACKUP_INTERVAL, ['OBJECT_PROP_CHANGED', 'OBJECT_UPDATED', 'OBJECT_REMOVED', CHANGE_FILE_PROPERTY], function* (action) {
        try {
            let file = yield select(state => state.editor.file.present);
            const stringifiedFile = JSON.stringify(file);
            localStorage.setItem("EDITOR_BACKUP", stringifiedFile);
            localStorage.setItem("EDITOR_BACKUP_DATE", JSON.stringify(new Date()));
            yield put({ type: SUPPRESS_BACKUP, flag: false});
        } catch (error) {
            console.log(error);
        }
    })
}

export function* backupNeededWatcher() {
    yield takeLatest([VARIANT.UPDATE.SUCCESS, VARIANT.CREATE.SUCCESS, GRAPHIC.CREATE.REQUEST], function* (action) {
        try {
            yield put({ type: SUPPRESS_BACKUP, flag: true });
        } catch (error) { console.log(error); }
    })
}