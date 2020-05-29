import {put, takeLatest, select, call, debounce} from "redux-saga/effects";
import axios from "axios";

export function* labelWriteWatcher() {
    yield takeLatest('OBJECT_PROP_CHANGED', function* (action) {
        if (action.prop === 'text') {
            try {
                let system = yield select(state => state.editor.file.system);
                const response = yield call(() => {
                    return axios({
                        method: 'POST',
                        url: '/braille',
                        data: {
                            label: action.value,
                            system
                        }
                    });
                });
                yield put({
                    type: 'OBJECT_PROP_CHANGED',
                    prop: 'braille',
                    value: response.data,
                    uuid: action.uuid
                });
            } catch (error) {
                console.error(error);
            }
        }
    })
}

export function* contentEditWatcher() {
    yield debounce(1000, 'CHANGE_PAGE_CONTENT', function* (action) {
        try {
            let system = yield select(state => state.editor.file.system);
            const response = yield call(() => {
                return axios({
                    method: 'POST',
                    url: '/braille',
                    data: {
                        label: action.formattedContent,
                        system
                    }
                });
            });
            yield put({
                type: 'UPDATE_BRAILLE_CONTENT',
                pageIndex: action.pageIndex,
                braille: response.data
            });
        } catch (error) {
            console.error(error);
        }

    })
}

export function* systemChangeWatcher() {
    yield takeLatest('DOCUMENT_PROP_CHANGED', function* (action) {
        if (action.prop === 'system') {
            try {
                let system = action.value;
                let labels = yield select(state => {
                    let labels = [];
                    state.editor.file.pages.forEach(page => {
                        page.objects.forEach(object => {
                            if (object.type === 'label') {
                                labels.push({
                                    text: object.text,
                                    uuid: object.uuid
                                })
                            }
                        })
                    });
                    return labels;
                });
                const response = yield call(() => {
                    return axios({
                        method: 'POST',
                        url: '/braille?bulk=true',
                        data: {
                            labels: labels,
                            system
                        }
                    });
                });
                yield put({
                    type: 'BRAILLE_BULK_TRANSLATED',
                    labels: response.data.labels
                })
            } catch (error) {
                console.error(error);
                // yield put({type: event.FAILURE, error});
            }
        }
    })
}