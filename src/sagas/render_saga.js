import {put, select, debounce} from "redux-saga/effects";
import {FILE} from "../actions/constants";
import {extractSVG} from "../components/editor/widgets/ReactSVG";

// TODO pauschal auch Durchführen vor dem Speichern
export function* renderWatcher() {
    yield debounce(1000, ['OBJECT_PROP_CHANGED', 'OBJECT_UPDATED', FILE.OPEN.SUCCESS], function* (action) {
        try {
            let pages = yield select(state => state.editor.file.pages);
            yield put({
                type: 'SET_PAGE_RENDERINGS',
                renderings: pages.map((page, index) => page.text ? null : extractSVG(index))
            });
        } catch (error) {
            console.log(error);
        }

    })
}