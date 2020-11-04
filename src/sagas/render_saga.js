import {put, select, debounce, call} from "redux-saga/effects";
import {FILE} from "../actions/action_constants";
import {extractSVG} from "../components/editor/ReactSVG";

// TODO pauschal auch Durchführen vor dem Speichern
export function* renderWatcher() {
    yield debounce(1000, ['OBJECT_PROP_CHANGED', 'OBJECT_UPDATED'], function* (action) {
        try {
            let file = yield select(state => state.editor.file);
            if (action.type !== FILE.OPEN.SUCCESS) localStorage.setItem("EDITOR_BACKUP", JSON.stringify(file.present));
            yield put({
                type: 'SET_PAGE_RENDERINGS',
                renderings: file.present.pages.map((page, index) => page.text ? null : extractSVG(index))
            });
        } catch (error) {
            console.log(error);
        }

    })
}