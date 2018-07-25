import loginSaga from "./user_saga";
import pageSaga from "./page_saga";
import {call, all} from "redux-saga/effects";

export default function* root() {
    yield all([
        call(loginSaga),
        call(pageSaga)
    ])
}