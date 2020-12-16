import {takeLatest, put, select, all} from "redux-saga/effects";
import {CHANGE_FILE_PROPERTY, OBJECT_PROP_CHANGED} from "../actions/action_constants";

export function* titleEditWatch() {
    yield takeLatest(OBJECT_PROP_CHANGED, function* (action) {
        try {
            if (action.prop === 'editMode' && !action.value) {
                let label = yield select(state =>
                    state.editor.file.present.pages[state.editor.ui.currentPage]
                        .objects.find(obj => obj.uuid === action.uuid));
                
                if (!label.isTitle) return;
                let titles = yield select(state =>
                    [].concat.apply([], state.editor.file.present.pages.map(page => page.objects))
                        .filter(obj => obj.isTitle));

                if (label.pristine && label.text.trim().length > 0) {
                    yield put({
                        type: CHANGE_FILE_PROPERTY,
                        key: 'graphicTitle',
                        value: label.text
                    })
                    yield put({
                        type: OBJECT_PROP_CHANGED,
                        prop: 'pristine',
                        value: false,
                        uuid: label.uuid
                    });
                }

                yield all(titles.map(title => put({
                    type: OBJECT_PROP_CHANGED,
                    prop: 'text',
                    value: label.text,
                    uuid: title.uuid
                })));
            }
        } catch (error) {
            console.log(error);
        }

    })
}