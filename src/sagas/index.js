import {loginWatcher, createWatcher, saveUserLayoutWatcher} from "./user_saga";

import {call, all, takeLatest, takeEvery, put} from "redux-saga/effects";
// import {patternsWatcher} from "./patterns_saga";
import localstorageWatcher from "./localstorage_saga";
import {versionCreateSaga, versionGetSaga} from "./version_saga";
import {variantGetSaga} from "./variant_saga";
import {CATALOGUE, TAGS, GRAPHIC, USER} from "../actions/constants";
import createSaga from "./saga_utilities";


export default function* root() {
    yield all([
        call(loginWatcher),
        call(createWatcher),
        call(createSaga(CATALOGUE.SEARCH, 'get', 'graphics', takeLatest, false)),
        call(createSaga(TAGS.GET, 'get', 'tags', takeLatest, false)),
        call(createSaga(GRAPHIC.CREATE, 'post', 'graphics', takeLatest, true)),
        call(createSaga(USER.VALIDATE, 'get', 'users/validate', takeLatest, true)),
        call(variantGetSaga),
        call(versionGetSaga),
        call(versionCreateSaga),
        call(localstorageWatcher)
    ])
}

