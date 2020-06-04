import {put, takeLatest, select, call, debounce} from "redux-saga/effects";
import axios from "axios";
import {wrapAndChunk, wrapLines} from "../utility/wrapLines";
import {chunk} from "lodash";

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
            let layout = yield select(state => state.editor.file.braillePages);
            const response = yield call(() => {
                return axios({
                    method: 'POST',
                    url: '/braille',
                    data: {
                        label: action.content,
                        system
                    }
                });
            });
            yield put({
                type: 'UPDATE_BRAILLE_CONTENT',
                pageIndex: action.pageIndex,
                braille: response.data,
                formatted: wrapAndChunk(response.data, layout.cellsPerRow, layout.rowsPerPage)
            });
        } catch (error) {
            console.error(error);
        }

    })
}

export function* layoutEditWatcher() {
    yield takeLatest('CHANGE_BRAILLE_PAGE_PROPERTY', function* (action) {
        console.log("CHANGE_BRAILLE_PAGE_PROPERTY");
        try {
            let layout = yield select(state => state.editor.file.braillePages);
            let pages = yield select(state => state.editor.file.pages);
            let action = {};
            pages.forEach((page, index) => {
                if (page.text) {
                    action = {
                        type: 'UPDATE_BRAILLE_CONTENT',
                        pageIndex: index,
                        braille: page.braille,
                        formatted: wrapAndChunk(page.braille, layout.cellsPerRow, layout.rowsPerPage)
                    };
                }
            })
            yield put(action);
        } catch (error) {
            console.log(error);
        }

    })
}

export function* systemChangeWatcher() {
    yield takeLatest('CHANGE_FILE_PROPERTY', function* (action) {
        // TODO auch Brailleseiten neu übersetzen
        console.log(action);
        if (action.key === 'system') {
            try {
                let system = action.value;
                let labels = yield select(state => {
                    let labels = [];
                    state.editor.file.pages.forEach((page, index) => {
                        if (page.text) {
                            labels.push({
                                text: page.content,
                                uuid: "__PAGE_" + index
                            })
                        } else {
                            page.objects.forEach(object => {
                                if (object.type === 'label') {
                                    labels.push({
                                        text: object.text,
                                        uuid: object.uuid
                                    })
                                }
                            })
                        }
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
                console.log(error);
                // yield put({type: event.FAILURE, error});
            }
        }
    })
}