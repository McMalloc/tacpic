import {take, put} from 'redux-saga/effects';

export default function* getWatcher() {
    yield take('CANVAS_INIT_START', ()=>{});
    yield take('CANVAS_INIT_DONE', initWorker)
}

function getPage(id) {

}

function* initWorker(action) {
    try {
        yield put({type: PAGE.GET.SUCCESS, page});
    } catch (error) {
        yield put({type: PAGE.GET.FAILURE, error});
    }
}