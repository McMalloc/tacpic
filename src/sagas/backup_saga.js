import {put, select, debounce, call} from "redux-saga/effects";
import {BACKUP_INTERVAL} from "../config/constants";
import {takeLatest} from "redux-saga/dist/redux-saga-effects-npm-proxy.esm";
import {GRAPHIC, SUPPRESS_BACKUP, VARIANT} from "../actions/action_constants";
import {extractSVG} from "../components/editor/ReactSVG";

// TODO pauschal auch Durchführen vor dem Speichern
export function* backupWatcher() {
    yield debounce(BACKUP_INTERVAL, ['OBJECT_PROP_CHANGED', 'OBJECT_UPDATED'], function* (action) {
        try {
            let file = yield select(state => state.editor.file.present);
            localStorage.setItem("EDITOR_BACKUP", JSON.stringify(file));
            localStorage.setItem("EDITOR_BACKUP_DATE", JSON.stringify(new Date()));
        } catch (error) {
            console.log(error);
        }
    })
}

export function* backupNeededWatcher() {
    yield takeLatest([VARIANT.UPDATE.SUCCESS, VARIANT.CREATE.SUCCESS, GRAPHIC.CREATE.REQUEST], function* (action) {
        try {
            yield put({ type: SUPPRESS_BACKUP });
        } catch (error) { console.log(error); }
    })
}