import {loginWatcher, saveUserLayoutWatcher} from "./user_saga";
import pageSaga from "./page_saga";
import {call, all} from "redux-saga/effects";
import resourceWatcher from "./resource_saga";

export default function* root() {
    yield all([
        call(loginWatcher),
        // call(saveUserLayoutWatcher),
        call(resourceWatcher),
        call(pageSaga)
    ])
}