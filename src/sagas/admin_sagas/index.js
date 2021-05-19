import {call, all, takeLatest} from "redux-saga/effects";
import {
    ORDER_ADMIN,
} from "../../actions/action_constants";
import createSaga from "../saga_utilities";

const id = args => args;

export default function* admin() {
    yield all([
        call(createSaga(ORDER_ADMIN.INDEX, 'get', 'internal/orders', takeLatest, true, null, id))
    ])
}

