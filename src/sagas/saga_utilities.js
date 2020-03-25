import {call, put} from "redux-saga/effects";
import axios from "axios";

const buildParams = (paramObj) => {
    let paramString = '';
    if (!paramObj) return paramString;

    paramString += '?';
    console.log(paramObj);
    for (const param in paramObj) {
        if (!paramObj.hasOwnProperty(param)) break;
        //
        // if (paramObj[param].length !== undefined && paramObj[param].length === 0) break;
        console.log(param, paramObj[param]);
        paramString += `${param}=${paramObj[param].toString()}&`
    }

    return paramString;
};

const replaceParam = (path, paramObj) => {
    let matches = path.match(/:[a-z_]+/g);
    let params = {...paramObj};
    if (matches !== null) {
        matches.forEach(match => {
            let param = match.slice(1); // get rid of the ":"
            if (params.hasOwnProperty(param)) {
                path = path.replace(match, params[param]);
                delete params[param];
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
 *
 * A redux action
 * @typedef {Object} Action
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
 * @param {Function} transformRequest A function to transform the data from the API upon a SUCCESS event. Leave undefined for identity.
 * @param {Function} transformResponse A function to transform the data to the API upon a REQUEST event. Leave undefined for identity.
 * @return {Saga} The callable saga.
 */
export default function createSaga(
    event,
    method,
    endpoint,
    effect,
    auth,
    transformRequest = args => { return args },
    transformResponse = args => { return args }) {
    return function* () {
        yield effect(event.REQUEST, function* (action) {
            try {
                const response = yield call(action => {

                    return fetch('/' + replaceParam(endpoint, action.payload), {
                        method: method,
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                            'Content-Type': 'application/json',
                        },
                        body: method === 'post' ? JSON.stringify(transformRequest(action.payload)) : null // body data type must match "Content-Type" header
                    }).then(response => response.json());

                    let request = {
                        method,
                        url: '/' + replaceParam(endpoint, action.payload) // + (method === 'get' ? buildParams(action.payload) : '')
                        // url: 'http://'+process.env.REACT_APP_API_HOST+'/' + replaceParam(endpoint, action.payload) // + (method === 'get' ? buildParams(action.payload) : '')
                    };
                    if (auth) request.headers = {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    };

                    if (method === 'post') request.data = transformRequest(action.payload);
                    return axios(request);
                }, action);
                let data = transformResponse(response);
                yield put({type: event.SUCCESS, data});
            } catch (error) {
                console.dir(error);
                yield put({type: event.FAILURE, error});
            }
        });
    }
}