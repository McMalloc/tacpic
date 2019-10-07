import {takeEvery, call, put} from 'redux-saga/effects';
import {SEARCH} from "../actions/constants";
import axios from "axios/index";
import uri_encode from "../utility/uri_encode";

export default function* queryWatcher() {
    yield takeEvery(SEARCH.QUERY.REQUEST, queryWorker);
}

/**
* Query search results from graphics database
* @param {Object} params
*   {Integer[]} tags
*   {String} search
*   {Integer} limit
*   {Integer} offset
 * @returns {Promise} - Will be resolved with an array of graphics.
*/
function query(params) {
    let uri_params = "?" + uri_encode(params);
    return axios({
        method: 'get',
        url: baseUrl + '/graphics' + uri_params
    });
}

function* queryWorker(action) {
    try {
        const response = yield call(query, action.payload);
        const results = response.data;

        yield put({type: SEARCH.QUERY.SUCCESS, results});
    } catch (error) {
        yield put({type: SEARCH.QUERY.FAILURE, error});
    }
}