import { takeLatest, select } from "redux-saga/effects";
import {API_URL} from '../env';
import {ERROR_THROWN} from "../actions/action_constants";

export function* errorWatcher() {
    yield takeLatest(ERROR_THROWN, function* () {
        const error = yield select(state => state.app.error);
        console.error(error)
        const backend_version = yield select(state => state.app.backend.tag);
        const frontend_version = yield select(state => state.app.frontend.tag);
        const report = {
            error,
            user_agent: window.navigator.userAgent,
            platform: window.navigator.platform,
            backend_version,
            frontend_version
        }
        yield fetch(API_URL + '/logging', {
            method: 'POST', body: JSON.stringify(report), headers: {'Content-Type': 'application/json'}
        });
    })
}