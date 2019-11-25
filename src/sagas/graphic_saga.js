import {takeLatest, takeEvery, call, put} from 'redux-saga/effects';
import {VERSION, CATALOGUE} from "../actions/constants";
import axios from "axios/index";
import uri_encode from "../utility/uri_encode";

// create new version for a given graphic
export function* versionCreateWatcher() {
    yield takeLatest(VERSION.CREATE.REQUEST, function* (action) {
        try {
            const response = yield call(createVersion, action);
            let data = response.data;
            yield put({type: VERSION.CREATE.SUCCESS, data});
        } catch (error) {
            console.error(error);
            yield put({type: VERSION.CREATE.FAILURE, error});
        }
    });
}

function createVersion(action) {
    return axios({
        method: 'post',
        url: 'http://localhost:9292/versions',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        data: action.payload
    });
}

