import {takeLatest} from "redux-saga/effects";
import {put, select} from "redux-saga/dist/redux-saga-effects-npm-proxy.esm";
import {CHANGE_FILE_PROPERTY} from "../actions/action_constants";

export function* titleEditWatch() {
    yield takeLatest('OBJECT_PROP_CHANGED', function* (action) {
        try {
            if (action.prop === 'editMode' && !action.value) {
                let label = yield select(state =>
                    state.editor.file.present.pages[action.shared_currentPage]
                        .objects.find(obj => obj.uuid === action.uuid));
                if (!label.isTitle) return;
                if (label.pristine && label.text.trim().length > 0) {
                    yield put({
                        type: CHANGE_FILE_PROPERTY,
                        key: 'graphicTitle',
                        value: label.text
                    })
                    yield put({
                        type: 'OBJECT_PROP_CHANGED',
                        prop: 'pristine',
                        value: false,
                        uuid: label.uuid
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }

    })
}