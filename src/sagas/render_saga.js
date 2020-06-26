import {put, select, debounce} from "redux-saga/effects";
import {FILE} from "../actions/action_constants";
import {extractSVG} from "../components/editor/widgets/ReactSVG";

// TODO pauschal auch Durchführen vor dem Speichern
export function* renderWatcher() {
    yield debounce(1000, ['OBJECT_PROP_CHANGED', 'OBJECT_UPDATED', FILE.OPEN.SUCCESS], function* (action) {
        try {
            let file = yield select(state => state.editor.file);
            localStorage.setItem("EDITOR_BACKUP", JSON.stringify(file));
            yield put({
                type: 'SET_PAGE_RENDERINGS',
                renderings: file.pages.map((page, index) => page.text ? null : extractSVG(index))
            });
        } catch (error) {
            console.log(error);
        }

    })
}