import { eventChannel } from "redux-saga";
import {
  put,
  takeLatest,
  select,
  debounce,
  take,
} from "redux-saga/effects";
import { wrapAndChunk } from "../utility/wrapLines";
import {
  CHANGE_IMAGE_DESCRIPTION,
  CHANGE_PAGE_CONTENT,
  ERROR_THROWN,
  OBJECT_BULK_ADD,
  OBJECT_PROP_CHANGED,
} from "../actions/action_constants";

/* eslint import/no-webpack-loader-syntax: off */
import Worker from "worker-loader!../workers/translate.worker.js";
import { BRAILLE_SYSTEMS } from "../config/constants";
import { keySelector } from "../reducers/selectors";

const translateWorker = new Worker();

function createWorkerChannel(worker) {
  return eventChannel((emit) => {
    worker.onmessage = event => emit(event.data);
    return worker.terminate;
  });
}

const translateWorkerChannel = createWorkerChannel(translateWorker);

const mapSystem = system => {
  const [lang, grade] = system.split(':');
  return BRAILLE_SYSTEMS[lang][grade];
}

export function* labelWriteWatcher() {
  yield debounce(100, OBJECT_PROP_CHANGED, function* (action) {
    if (action.prop === "text") {
      try {
        let system = yield select(state => mapSystem(state.editor.file.present.system));
        translateWorker.postMessage({ text: action.value, system });
        const response = yield take(translateWorkerChannel);
        yield put({
          type: "OBJECT_PROP_CHANGED",
          prop: "braille",
          value: response,
          uuid: action.uuid,
        });
      } catch (error) {
        put({type: ERROR_THROWN, error})
      }
    }
  });
}

export function* textureKeyChangeWatcher() {
  yield debounce(100, "KEY_TEXTURE_CHANGED", function* (action) {
    try {
      let system = yield select((state) => mapSystem(state.editor.file.present.system));
      translateWorker.postMessage({ text: action.label, system });
      const response = yield take(translateWorkerChannel);
      yield put({
        type: "KEY_TEXTURE_TRANSLATED",
        braille: response,
        pattern: action.pattern,
      });
    } catch (error) {
      put({type: ERROR_THROWN, error})
    }
  });
}

export function* labelKeyWatcher() {
  yield takeLatest(OBJECT_PROP_CHANGED, function* (action) {
    try {
      if (action.type === OBJECT_PROP_CHANGED && action.prop === 'isKey' && action.value) {
        let key = yield select(keySelector);
        key = Array.isArray(key) ? key[0] : key;
        if (!key.active) yield put({type: OBJECT_PROP_CHANGED, uuid: key.uuid, prop: 'active', value: true});
      }
    } catch (error) {
      put({type: ERROR_THROWN, error})
    }
  });
}

export function* contentEditWatcher() {
  yield debounce(
    100,
    [CHANGE_PAGE_CONTENT, CHANGE_IMAGE_DESCRIPTION],
    function* (action) {
      try {
        let system = yield select((state) => mapSystem(state.editor.file.present.system));
        let braillePages = yield select(
          (state) => state.editor.file.present.braillePages
        );
        const concatinated =
          Object.keys(braillePages.imageDescription).reduce(
            (accumulator, blockKey) =>
              accumulator + braillePages.imageDescription[blockKey] + "\n\n",
            ""
          ) + braillePages.content;
        translateWorker.postMessage({ text: concatinated, system });
        const response = yield take(translateWorkerChannel);
        yield put({
          type: "UPDATE_BRAILLE_CONTENT",
          braille: response,
          formatted: wrapAndChunk(
            response,
            braillePages.cellsPerRow,
            braillePages.rowsPerPage
          ),
        });
      } catch (error) {
        put({type: ERROR_THROWN, error})
      }
    }
  );
}

export function* layoutEditWatcher() {
  yield takeLatest("CHANGE_BRAILLE_PAGE_PROPERTY", function* (action) {
    try {
      let braillePages = yield select(
        (state) => state.editor.file.present.braillePages
      );
      yield put({
        type: "UPDATE_BRAILLE_CONTENT",
        braille: braillePages.braille,
        formatted: wrapAndChunk(
          braillePages.braille,
          braillePages.cellsPerRow,
          braillePages.rowsPerPage
        ),
      });
    } catch (error) {
      put({type: ERROR_THROWN, error})
    }
  });
}

export function* systemChangeWatcher() {
  yield debounce(200, "CHANGE_FILE_PROPERTY", function* (action) {
    // TODO auch Brailleseiten neu übersetzen
    if (action.key === "system") {
      try {
        let system = mapSystem(action.value);
        let braillePages = yield select(
          state => state.editor.file.present.braillePages
        );
        const concatinated =
          Object.keys(braillePages.imageDescription).reduce(
            (accumulator, blockKey) =>
              accumulator + braillePages.imageDescription[blockKey] + "\n\n",
            ""
          ) + braillePages.content;

        if (concatinated.trim().length > 0) {
          translateWorker.postMessage({ text: concatinated, system });
          const response = yield take(translateWorkerChannel);
          yield put({
            type: "UPDATE_BRAILLE_CONTENT",
            braille: response,
            formatted: wrapAndChunk(
              response,
              braillePages.cellsPerRow,
              braillePages.rowsPerPage
            ),
          });
        }

        let labels = yield select((state) => {
          let labels = [];
          state.editor.file.present.pages.forEach((page, index) => {
            page.objects.forEach((object) => {
              if (object.type === "label") {
                labels.push({
                  text: object.text,
                  uuid: object.uuid,
                });
              }
            });
          });
          return labels;
        });

        for (let label of labels) {
          translateWorker.postMessage({ text: label.text, system });
          const response = yield take(translateWorkerChannel);
          yield put({
            type: OBJECT_PROP_CHANGED,
            undoIgnore: true,
            prop: "braille",
            value: response,
            uuid: label.uuid,
          });
        }
      } catch (error) {
        console.log(error);
        // yield put({type: event.FAILURE, error});
      }
    }
  });
}

export function* ocrImportWatcher() {
  yield takeLatest(OBJECT_BULK_ADD, function* (action) {
    if (
      action.objects.length ===
      action.objects.filter((object) => object.type === "label").length
    ) {
      // all objects are labels
      try {
        let system = yield select((state) => mapSystem(state.editor.file.present.system));
        for (var label of action.objects) {
          translateWorker.postMessage({ text: label.text, system });
          const response = yield take(translateWorkerChannel);
          yield put({
            type: OBJECT_PROP_CHANGED,
            prop: "braille",
            value: response,
            uuid: label.uuid,
          });
        }
      } catch (error) {
        put({type: ERROR_THROWN, error})
      }
    }
  });
}
