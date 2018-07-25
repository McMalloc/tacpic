import {takeEvery, call, put} from 'redux-saga/effects';
import {PAGE} from "../actions/constants";
import axios from "axios/index";

export default function* getWatcher() {
    yield takeEvery(PAGE.GET.REQUEST, getWorker);
}

function getPage(id) {
    return axios({
        method: 'get',
        url: 'http://localhost/wordpress/wp-json/wp/v2/pages/' + id
    });
}

function* getWorker(action) {
    try {
        const response = yield call(getPage, action.payload);
        const page = response.data;

        yield put({type: PAGE.GET.SUCCESS, page});
    } catch (error) {
        yield put({type: PAGE.GET.FAILURE, error});
    }
}