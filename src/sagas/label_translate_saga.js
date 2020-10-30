import {put, takeLatest, select, call, debounce} from "redux-saga/effects";
import axios from "axios";
import {wrapAndChunk, wrapLines} from "../utility/wrapLines";
import {chunk} from "lodash";
import {API_URL} from "../env"
import {CHANGE_IMAGE_DESCRIPTION, CHANGE_PAGE_CONTENT, OBJECT_BULK_ADD} from "../actions/action_constants";

const sanitise = text => {
    return text.replace("%", "%%").replace(/\u00AD/, "");
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

export function* textureKeyChangeWatcher() {
    yield debounce(1000, 'KEY_TEXTURE_CHANGED', function* (action) {
        try {
            let system = yield select(state => state.editor.file.present.system);
            const response = yield call(() => {
                return axios({
                    method: 'POST',
                    url: API_URL + '/braille',
                    data: {
                        label: sanitise(action.label),
                        system
                    }
                });
            });
            yield put({
                type: 'KEY_TEXTURE_TRANSLATED',
                braille: response.data,
                pattern: action.pattern
            });
        } catch (error) {
            console.error(error);
        }
    })
}

export function* contentEditWatcher() {
    yield debounce(1000, [CHANGE_PAGE_CONTENT, CHANGE_IMAGE_DESCRIPTION], function* (action) {
        try {
            let system = yield select(state => state.editor.file.present.system);
            let braillePages = yield select(state => state.editor.file.present.braillePages);
            const concatinated = Object.keys(braillePages.imageDescription)
                    .reduce((accumulator, blockKey) => accumulator + braillePages.imageDescription[blockKey] + "\n\n", "")
                + braillePages.content;
            const response = yield call(() => {
                return axios({
                    method: 'POST',
                    url: API_URL + '/braille',
                    data: {
                        label: sanitise(concatinated),
                        system
                    }
                });
            });
            yield put({
                type: 'UPDATE_BRAILLE_CONTENT',
                braille: response.data,
                formatted: wrapAndChunk(response.data, braillePages.cellsPerRow, braillePages.rowsPerPage)
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
                let braillePages = yield select(state => state.editor.file.present.braillePages);
                let labels = yield select(state => {
                    let labels = [];
                    state.editor.file.present.pages.forEach((page, index) => {
                        page.objects.forEach(object => {
                            if (object.type === 'label') {
                                labels.push({
                                    text: object.text,
                                    uuid: object.uuid
                                })
                            }
                        })
                    });
                    const concatinated = Object.keys(braillePages.imageDescription)
                            .reduce((accumulator, blockKey) => accumulator + braillePages.imageDescription[blockKey] + "\n\n", "")
                        + braillePages.content;
                    labels.push({
                        text: concatinated,
                        uuid: '_BRAILLE_PAGES'
                    })
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
        if (action.objects.length === action.objects.filter(object => object.type === 'label').length) { // all objects are labels
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