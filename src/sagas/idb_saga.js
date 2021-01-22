import { call, put, takeLatest } from "redux-saga/effects";
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { LOCALFILES } from "../actions/action_constants";

export function* idbInit() {
    return yield call(openDB, 'db', 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            window.idb = db;
            console.log("db upgrade: ", newVersion);
            db.createObjectStore('files', {
                keyPath: 'uuid'
            });
        }, blocked() { }, blocking() { }, terminated() { },
    });
}

export function* idbIndexWatcher() {
    yield takeLatest(LOCALFILES.INDEX.REQUEST, function* () {
        const dbInstance = yield call(idbInit);
        // const dbInstance = yield call(openDB);

        const transaction = dbInstance.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        const index = yield store.getAll();
        yield put({
            type: LOCALFILES.INDEX.SUCCESS,
            index
        })
    });
}

export function* idbRemoveWatcher() {
    yield takeLatest(LOCALFILES.REMOVE.REQUEST, function* (action) {
        try {
            const dbInstance = yield call(idbInit);
            // const dbInstance = yield call(openDB);

            const transaction = dbInstance.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            yield store.delete(action.uuid);
            yield put({
                type: LOCALFILES.REMOVE.SUCCESS
            })
            yield put({
                type: LOCALFILES.INDEX.REQUEST
            })
        } catch (error) {
            yield put({
                type: LOCALFILES.REMOVE.FAILURE,
                error
            })
        }
        
    });
}

