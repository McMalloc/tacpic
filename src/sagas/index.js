import {logoutWatcher} from "./user_saga";
import {call, all, takeLatest, takeEvery, put} from "redux-saga/effects";
import localstorageWatcher from "./localstorage_saga";
import {
    variantUpdateSaga,
    variantGetSaga,
    variantCreateSaga
} from "./variant_saga";
import {openFileWatcher} from "./file_saga";
import {CATALOGUE, TAGS, GRAPHIC, USER, VARIANT} from "../actions/constants";
import createSaga from "./saga_utilities";
import extractSVG from "../utility/extractSVG";
import {
    searchChangeWatcher,
    catalogueSearchSaga,
    tagToggledWatcher,
    formatToggledWatcher,
    systemToggledWatcher
} from "./catalogue_saga";
import {labelWriteWatcher, systemChangeWatcher} from "./label_translate_saga";

const id = args => args;

export default function* root() {
    yield all([
        // call(loginWatcher),
        call(logoutWatcher),
        call(createSaga(TAGS.GET, 'get', 'tags?limit=:limit', takeLatest, true, null, tags => {
            return tags;
        })),
        call(createSaga(GRAPHIC.CREATE, 'post', 'graphics', takeLatest, true, file => {
            file.renderedPreview = extractSVG();
            return file;
        })),
        call(createSaga(GRAPHIC.GET, 'get', 'graphics/:id', takeLatest, false, null)),
        call(createSaga(USER.VALIDATE, 'get', 'users/validate', takeLatest, true, null, id)),
        // call(createSaga(USER.LOGOUT, 'post', 'logout', takeLatest, true, id, id)),
        call(createSaga(USER.CREATE, 'post', 'create-account', takeLatest, false, request => {
            return {
                login: request.uname,
                "login-confirm": request.uname,
                password: request.pwd,
                "password-confirm": request.pwdConfirm,
            }
        }, (response, statusCode, headers) => {
            localStorage.setItem('jwt', headers.authorization);
            return response;
        })),
        call(createSaga(USER.LOGIN, 'post', 'login', takeLatest, false, request => request, (response, statusCode, authHeader) => {
            localStorage.setItem('jwt', authHeader);
            return response;
        })),
        call(variantGetSaga),
        call(openFileWatcher),
        call(catalogueSearchSaga),
        call(variantUpdateSaga),
        call(variantCreateSaga),
        call(localstorageWatcher),
        call(searchChangeWatcher),
        call(labelWriteWatcher),
        call(systemChangeWatcher),
        call(tagToggledWatcher),
        call(formatToggledWatcher),
        call(systemToggledWatcher)
    ])
}

