import { call } from "redux-saga/effects";
import { openDB } from 'idb';

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

export function* idbWrite(store, value, key) {
    try {
        const dbInstance = yield call(idbInit);
        if (!!key) return yield dbInstance.put(store, value, key);
        return yield dbInstance.put(store, value);
    } catch (error) {
        console.error(error);
        return yield error;
    }
}

export function* idbRemove(store, key) {
    try {
        const dbInstance = yield call(idbInit);
        return yield dbInstance.delete(store, key);
    } catch (error) {
        console.error(error);
        return yield error;
    }
}

export function* idbIndex(store) {
    const dbInstance = yield call(idbInit);
    return yield dbInstance
        .transaction([store], 'readonly')
        .objectStore(store)
        .getAll();
}