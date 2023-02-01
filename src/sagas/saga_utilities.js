import { call, put, select } from "redux-saga/effects";
import env from '../env';
import { CONTENT_TYPE } from "../config/constants";
import { getCache, setCache } from "./cache";
import i18n from "i18next";

const buildParams = (paramObj) => {
    let paramString = '';
    if (!paramObj) return paramString;

    paramString += '?';
    for (const param in paramObj) {
        if (!paramObj.hasOwnProperty(param)) break;
        paramString += `${param}=${paramObj[param].toString()}&`
    }

    return paramString;
};

const replaceParam = (path, paramObj) => {
    let matches = path.match(/:[a-zA-Z_\[\]]+/g);
    let params = { ...paramObj };
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

const crawlState = (state, path) => {
    if (path.length === 0) return state;
    return crawlState(state[path[0]], path.slice(1));
}

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
 * @param {Array<String>} appendedStatePath String of property names to select a property from the state which will be appended to the payload.
 * @return {Saga} The callable saga.
 */
export default function createSaga(
    event,
    method,
    endpoint,
    effect,
    auth,
    transformRequest = args => { return args },
    transformResponse = args => { return args },
    appendedStatePath = []) {
    return function* () {
        if (!event) throw "Unknown event for endpoint: " + endpoint;
        yield effect(event.REQUEST, function* (action) {
            if (appendedStatePath && appendedStatePath.length > 0) {
                action.payload[appendedStatePath[appendedStatePath.length - 1]] =
                    yield select(state => crawlState(state, appendedStatePath));
            }
            const frontendVersion = yield select(state => state.app.frontend.tag)
            try {
                let statusCode = 1000;
                let authHeader = "";
                let contentType = "";
                let endpointWithParams = replaceParam(endpoint, action.payload);
                let response;

                let cached = method === 'get' ? getCache(endpointWithParams) : null;
                if (cached === null) {
                    response = yield call(action => {
                        const filePayload = action.payload && action.payload.toString() === '[object FormData]';
                        let headers = {
                            'Accept': 'application/json',
                            'Accept-Language': i18n.language,
                            'Tacpic-Version': frontendVersion
                        };
                        if (!filePayload) headers['Content-Type'] = 'application/json';
                        if (auth) {
                            const jwt = localStorage.getItem('jwt');
                            if (jwt !== null) headers.Authorization = 'Bearer ' + jwt;
                        }
                        return fetch(env.API_URL + '/' + endpointWithParams, {
                            method,
                            headers,
                            body: method === 'post' ?
                                filePayload ? action.payload : JSON.stringify(transformRequest(action.payload)) : null // body data type must match "Content-Type" header
                        }).then(response => {
                            statusCode = response.status;
                            authHeader = response.headers.get("authorization");
                            contentType = response.headers.get("Content-Type");
                            return response.text();
                        })
                    }, action);
                    setCache(endpointWithParams, response);
                } else {
                    response = yield call(getCache, endpointWithParams)
                }

                let parsedResponse;
                try {
                    if (contentType?.toLowerCase().includes(CONTENT_TYPE.JSON)) {
                        parsedResponse = JSON.parse(response);
                    } else {
                        parsedResponse = response;
                    }
                } catch (e) {
                    console.error(e);
                    parsedResponse = response;
                }

                if (statusCode > 204) {
                    yield put({ type: event.FAILURE, message: parsedResponse, originalPayload: action.payload, statusCode });
                } else {
                    let data = transformResponse(parsedResponse, statusCode, authHeader);
                    yield put({ type: event.SUCCESS, data, originalPayload: action.payload, statusCode });
                }
            } catch (error) {
                console.error(event.toString(), error);
                yield put({ type: event.FAILURE, error });
            }
        });
    }
}