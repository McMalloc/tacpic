import {loginWatcher, createWatcher, saveUserLayoutWatcher} from "./user_saga";
import {call, all, takeLatest, takeEvery, put} from "redux-saga/effects";
import localstorageWatcher from "./localstorage_saga";
import {versionGetSaga} from "./version_saga";
import {variantUpdateSaga, variantGetSaga} from "./variant_saga";
import {openFileWatcher} from "./file_saga";
import {CATALOGUE, TAGS, GRAPHIC, USER, VARIANT} from "../actions/constants";
import createSaga from "./saga_utilities";


export default function* root() {
    yield all([
        call(loginWatcher),
        call(createWatcher),
        call(createSaga(CATALOGUE.SEARCH, 'get', 'graphics', takeLatest, false)),
        call(createSaga(TAGS.GET, 'get', 'tags?limit=:limit', takeLatest, false)),
        call(createSaga(GRAPHIC.CREATE, 'post', 'graphics', takeLatest, true)),
        call(createSaga(USER.VALIDATE, 'get', 'users/validate', takeLatest, true)),
        call(createSaga(VARIANT.CREATE, 'post', 'variants', takeLatest, true)),
        call(variantGetSaga),
        call(openFileWatcher),
        call(versionGetSaga),
        call(variantUpdateSaga),
        call(localstorageWatcher)
    ])
}

