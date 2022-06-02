import {call, all, takeLatest} from "redux-saga/effects";
import {
    ADMIN,
    ORDER_ADMIN,
    USER_ADMIN
} from "../../actions/action_constants";
import createSaga from "../saga_utilities";

const id = args => args;

export default function* admin() {
    yield all([
        call(createSaga(ORDER_ADMIN.INDEX, 'get', 'internal/orders', takeLatest, true, null, id)),
        call(createSaga(ORDER_ADMIN.GET, 'get', 'internal/orders/:id', takeLatest, true, null, id)),
        call(createSaga(ORDER_ADMIN.RPC, 'post', 'internal/orders/:id/rpc', takeLatest, true, id, id)),

        call(createSaga(USER_ADMIN.INDEX, 'get', 'internal/users', takeLatest, true, null, id)),
        call(createSaga(USER_ADMIN.GET, 'get', 'internal/users/:id', takeLatest, true, null, id)),
        // call(createSaga(ORDER_ADMIN.RPC, 'post', 'internal/orders/:id/rpc', takeLatest, true, id, id)),

        call(createSaga(ADMIN.FRONTEND_ERRORS, 'get', 'internal/errors/frontend', takeLatest, true, id, id)),
        call(createSaga(ADMIN.BACKEND_ERRORS, 'get', 'internal/errors/backend', takeLatest, true, id, id)),
        call(createSaga(ADMIN.VOUCHER_INDEX, 'get', 'internal/vouchers', takeLatest, true, id, id)),
        call(createSaga(ADMIN.LOG_INDEX, 'get', 'internal/logs', takeLatest, true, id, filenames => {
            return filenames.map(filename => ({
                ...filename,
                createdAt: filename.name.substring(4, filename.name.length - 4)
            }))
        })),
        call(createSaga(ADMIN.LOG, 'get', 'internal/logs/:name', takeLatest, true, id, id))
    ])
}

