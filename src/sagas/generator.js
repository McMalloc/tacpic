// create new version for a given graphic
import {VERSION} from "../actions/constants";
import axios from "axios";
import {put, call} from "redux-saga/effects";

export default function register(event, method, endpoint, effect, auth) {
    return function* () {
        yield effect(event.REQUEST, function* (action) {
            try {
                const response = yield call(action => {
                    let request = {
                        method,
                        url: '/' + endpoint,
                        data: action.payload
                    };
                    if (auth) request.header = {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    };
                    if (method === 'post') request.data = action.payload;
                    if (method === 'get') request.params = action.payload;
                    return axios(request);
                }, action);
                let data = response.data;
                yield put({type: event.SUCCESS, data});
            } catch (error) {
                console.error(error);
                yield put({type: event.FAILURE, error});
            }
        });
    }
}