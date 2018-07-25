import {takeLatest, call, put} from 'redux-saga/effects';
import {PRODUCT} from "../actions/constants";
import axios from "axios/index";

export default function* fetchWatcher() {
    yield takeLatest(PRODUCT.FETCH.REQUEST, fetchWorker);
}

function fetchProducts(action) {
    return axios({
        method: 'get',
        url: 'http://localhost/wordpress/wp-json/wc/v2/products',
        headers: {
            'Authorization': 'Bearer ' + localStorage.get('jwt')
        },
        data: {
            username: action.payload.unameField.value,
            password: action.payload.pwdField.value
        }
    });
}

function* fetchWorker(action) {
    try {
        const response = yield call(fetchProducts, action);
        const products = response.data;

        yield put({type: PRODUCT.FETCH.SUCCESS, products});
    } catch (error) {
        yield put({type: PRODUCT.FETCH.FAILURE, error});
    }
}