import {call, put} from "@redux-saga/core/effects";
import axios from "axios";

const replaceParam = (path, paramObj) => {
    let matches = path.match(/:[a-z]+/g);
    if (matches !== null) {
        matches.forEach(match => {
            let param = match.slice(1); // get rid of the ":"
            if (paramObj.hasOwnProperty(param)) {
                path = path.replace(match, paramObj[param]);
                delete paramObj[param];
            }
        })
    }
    return path;
};


/**
 * A redux saga effect
 * @typedef {Function} SagaEffect
 *
 * A redux saga
 * @typedef {Function} Saga
 */

/**
 * Creates a saga for watching and handling common API intercations.
 *
 * @param {String} event The action object representing the api interaction.
 *   Must have all three transaction states: REQUEST, SUCCESS and FAILURE, containing the corresponding strings that will get
 *   matched in the reducer. A REQUEST action will trigger an API call and may contain a parameter object in the payload property.
 * @param {String} method HTTP method/verb.
 * @param {String} endpoint The API endpoint, without leading slash. Will be appended to the application domain to form a complete path for the
 *   requested ressource. Can contain parameters, that are between slashes and prepended with a colon (eg. "users/:id/profile").
 *   If the parameter object of the REQUEST action contains a parameter with the same name, it gets replaced instead of being
 *   send with the request payload.
 * @param {SagaEffect} effect The desired effect, eg. `takeLatest` for only executing the latest incoming REQUEST.
 * @param {Boolean} auth Passing `true` will add the Authorization header to the REQUEST, setting its value to the JWT
 *   saved in `localStorage`
 * @param {Function} transform A function to transform the data from the API upon a SUCCESS event. Leave undefined for identity.
 */
export default function createSaga(event, method, endpoint, effect, auth, transform = args => { return args }) {
    return function* () {
        yield effect(event.REQUEST, function* (action) {
            try {
                const response = yield call(action => {
                    let request = {
                        method,
                        url: '/' + replaceParam(endpoint, action.payload)
                    };
                    if (auth) request.headers = {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt') // propably should be own saga :(
                    };

                    if (method === 'post') request.data = action.payload;
                    return axios(request);
                }, action);
                let data = transform(response.data);
                yield put({type: event.SUCCESS, data});
            } catch (error) {
                console.error(error);
                yield put({type: event.FAILURE, error});
            }
        });
    }
}