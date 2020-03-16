import {loginWatcher, createWatcher, saveUserLayoutWatcher} from "./user_saga";
import {call, all, takeLatest, takeEvery, put} from "redux-saga/effects";
import localstorageWatcher from "./localstorage_saga";
import {variantUpdateSaga,
        variantGetSaga,
        variantCreateSaga} from "./variant_saga";
import {openFileWatcher} from "./file_saga";
import {CATALOGUE, TAGS, GRAPHIC, USER, VARIANT} from "../actions/constants";
import createSaga from "./saga_utilities";
import extractSVG from "../utility/extractSVG";
import {searchChangeWatcher,
        catalogueSearchSaga,
        tagToggledWatcher,
        formatToggledWatcher,
        systemToggledWatcher} from "./catalogue_saga";
import {labelWriteWatcher, systemChangeWatcher} from "./label_translate_saga";


export default function* root() {
    yield all([
        call(loginWatcher),
        call(createWatcher),
        call(createSaga(TAGS.GET, 'get', 'tags?limit=:limit', takeLatest, true, null, tags => {
            return tags;
        })),
        call(createSaga(GRAPHIC.CREATE, 'post', 'graphics', takeLatest, true, file => {
            file.renderedPreview = extractSVG();
            return file;
        })),
        call(createSaga(GRAPHIC.GET, 'get', 'graphics/:id', takeLatest, false, null)),
        call(createSaga(USER.VALIDATE, 'get', 'users/validate', takeLatest, true)),
        // call(createSaga(BRAILLE.TRANSLATE)),
        call(variantGetSaga),
        call(openFileWatcher),
        call(catalogueSearchSaga),
        call(variantUpdateSaga),
        call(variantCreateSaga),
        call(localstorageWatcher),
        call(searchChangeWatcher),
        call(labelWriteWatcher),
        call(systemChangeWatcher),
        call(tagToggledWatcher),
        call(formatToggledWatcher),
        call(systemToggledWatcher)
    ])
}

