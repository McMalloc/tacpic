import { select, throttle, call } from "redux-saga/effects";
import { BACKUP_INTERVAL } from "../config/constants";
import { CHANGE_FILE_PROPERTY } from "../actions/action_constants";
import { openDB, deleteDB, wrap, unwrap } from 'idb';

// TODO pauschal auch Durchführen vor dem Speichern



export function* backupWatcher() {
    yield throttle(BACKUP_INTERVAL, ['OBJECT_PROP_CHANGED', 'OBJECT_UPDATED', 'OBJECT_REMOVED', CHANGE_FILE_PROPERTY], function* (action) {
        try {
            document.getElementById("save-indicator").style.visibility = 'visible';
            let file = yield select(state => state.editor.file.present);
            const db = yield call(openDB, 'db');

            const transaction = db.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');

            if (file.hasOwnProperty('uuid') && file.uuid !== null) {
                store.put({ ...file, lastSaved: new Date() });
            }

            setTimeout(() => {
                    const elem = document.getElementById("save-indicator");
                    if (!!elem) document.getElementById("save-indicator").style.visibility = 'hidden'
                }, 1500);

            yield transaction.complete;
        } catch (error) {
            console.error(error);
        }
    })
}