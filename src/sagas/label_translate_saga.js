import {put, takeLatest, select, call, debounce} from "redux-saga/effects";
import axios from "axios";
import {wrapAndChunk, wrapLines} from "../utility/wrapLines";
import {chunk} from "lodash";
import {API_URL} from "../env"
import {CHANGE_PAGE_CONTENT, OBJECT_BULK_ADD} from "../actions/action_constants";

const sanitise = text => {
    return text.replace("%", "%%")
}

export function* labelWriteWatcher() {
    yield debounce(500, 'OBJECT_PROP_CHANGED', function* (action) {
        if (action.prop === 'text') {
            try {
                let system = yield select(state => state.editor.file.present.system);
                const response = yield call(() => {
                    return axios({
                        method: 'POST',
                        url: API_URL + '/braille',
                        data: {
                            label: sanitise(action.value),
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
    yield debounce(1000, CHANGE_PAGE_CONTENT, function* (action) {
        try {
            let system = yield select(state => state.editor.file.present.system);
            let layout = yield select(state => state.editor.file.present.braillePages);
            const response = yield call(() => {
                return axios({
                    method: 'POST',
                    url: API_URL + '/braille',
                    data: {
                        label: sanitise(action.content),
                        system
                    }
                });
            });
            yield put({
                type: 'UPDATE_BRAILLE_CONTENT',
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
        try {
            let braillePages = yield select(state => state.editor.file.present.braillePages);
            yield put({
                type: 'UPDATE_BRAILLE_CONTENT',
                braille: braillePages.braille,
                formatted: wrapAndChunk(braillePages.braille, braillePages.cellsPerRow, braillePages.rowsPerPage)
            });
        } catch (error) {
            console.log(error);
        }

    })
}

export function* systemChangeWatcher() {
    yield takeLatest('CHANGE_FILE_PROPERTY', function* (action) {
        // TODO auch Brailleseiten neu übersetzen
        if (action.key === 'system') {
            try {
                let system = action.value;
                let labels = yield select(state => {
                    let labels = [];
                    state.editor.file.present.pages.forEach((page, index) => {
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
                        url: API_URL + '/braille?bulk=true',
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

export function* ocrImportWatcher() {
    yield takeLatest(OBJECT_BULK_ADD, function* (action) {
        if (action.objects.length === action.objects.filter(object=>object.type === 'label').length) { // all objects are labels
            try {
                let system = yield select(state => state.editor.file.present.system);
                const response = yield call(() => {
                    return axios({
                        method: 'POST',
                        url: API_URL + '/braille?bulk=true',
                        data: {
                            labels: action.objects,
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