import {put, select, takeLatest} from "redux-saga/effects";
import {OBJECT_SELECTED} from "../actions/action_constants";
import {extractSVG} from "../components/editor/ReactSVG";
import {flatten} from "lodash";

const pageWithObjectSelector = (state, uuid) => {
    let pageIndex = null;
    flatten(state.editor.file.present.pages.map((page, index) => {
            if (pageIndex === null && page.objects.map(object => object.uuid).includes(uuid)) pageIndex = index;
        }
    ));
    return pageIndex;
};

export function* objectSelectedWatcher() {
    yield takeLatest(OBJECT_SELECTED, function* (action) {
        try {
            // ignore if deselected or initiated from within this saga
            if (action.uuids[0] === null || !!action.fromSaga) return;
            let currentPage = yield select(state => state.editor.ui.currentPage);
            let pageWithSelectedObject = yield select(state => pageWithObjectSelector(state, action.uuids[0]));

            if (currentPage !== pageWithSelectedObject) {
                yield put({
                    type: 'PAGE_CHANGE',
                    number: pageWithSelectedObject
                })
                yield put({
                    type: OBJECT_SELECTED,
                    uuids: action.uuids,
                    fromSaga: true
                })
            }
        } catch (error) {
            console.log(error);
        }

    })
}