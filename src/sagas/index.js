import {loginWatcher, saveUserLayoutWatcher} from "./user_saga";
import pageSaga from "./page_saga";
import {call, all, takeLatest, takeEvery} from "redux-saga/effects";
import resourceWatcher from "./resource_saga";
// import {patternsWatcher} from "./patterns_saga";
import localstorageWatcher from "./localstorage_saga";
import {versionCreateWatcher, queryWatcher} from "./graphic_saga";
import register from "./generator";
import {CATALOGUE, TAGS, VERSION} from "../actions/constants";

export default function* root() {
    yield all([
        call(loginWatcher),
        // call(queryWatcher),
        call(register(CATALOGUE.SEARCH, 'get', 'graphics', takeLatest, false)),
        call(register(TAGS.GET, 'get', 'tags', takeLatest, false)),
        call(register(VERSION.CREATE, 'post', 'versions', takeLatest, true)),
        call(localstorageWatcher)
        // call(patternsWatcher),
        // call(saveUserLayoutWatcher),
        // call(resourceWatcher),
        // call(pageSaga)
    ])
}