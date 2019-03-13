import {loginWatcher, saveUserLayoutWatcher} from "./user_saga";
import pageSaga from "./page_saga";
import {call, all} from "redux-saga/effects";
import resourceWatcher from "./resource_saga";
// import {patternsWatcher} from "./patterns_saga";

export default function* root() {
    yield all([
        call(loginWatcher),
        // call(patternsWatcher),
        // call(saveUserLayoutWatcher),
        call(resourceWatcher),
        call(pageSaga)
    ])
}