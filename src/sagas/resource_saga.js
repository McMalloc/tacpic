import {takeLatest, put, all, fork} from 'redux-saga/effects';
import {PRODUCT, RESSOURCES} from "../actions/constants";
import axios from "axios/index";

export default function* resourceWatcher() {
    yield takeLatest(RESSOURCES.GET.REQUEST, getWorker);
}

//TODO alle Patterns, Fonts, etc

function getResources(res) {
    return axios({
        method: 'get',
        url: 'http://localhost/wordpress/wp-json/wc/v2/products',
        // headers: {
        //     'Authorization': 'Bearer ' + localStorage.get('jwt') //todo wegabstrahieren, eventuell auch nicht nötig?
        // }
    });
}

function* getWorker(action) {
    try {
        const response = yield all([
            fork(getResources, [''])
        ]);
        const products = response.data;

        yield put({type: PRODUCT.FETCH.SUCCESS, products});
    } catch (error) {
        yield put({type: PRODUCT.FETCH.FAILURE, error});
    }
}