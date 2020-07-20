import {logoutWatcher, userCreateSaga, userLoginSaga, userLogoutSaga, userValidateSaga} from "./user_saga";
import {call, all, takeLatest, takeEvery, put, select} from "redux-saga/effects";
import localstorageWatcher from "./localstorage_saga";
import {
    variantUpdateSaga,
    variantGetSaga,
    variantCreateSaga
} from "./variant_saga";
import {openFileWatcher} from "./file_saga";
import {CATALOGUE, TAGS, GRAPHIC, USER, VARIANT, VERSION, ORDER, VARIANTS, ADDRESS} from "../actions/action_constants";
import createSaga from "./saga_utilities";
import {
    searchChangeWatcher,
    catalogueSearchSaga,
    tagToggledWatcher,
    formatToggledWatcher,
    systemToggledWatcher
} from "./catalogue_saga";
import {contentEditWatcher, labelWriteWatcher, layoutEditWatcher, systemChangeWatcher} from "./label_translate_saga";
import {renderWatcher} from "./render_saga";
import {addressRemoveSaga} from "./address_saga";

export const id = args => args;

export default function* root() {
    yield all([
        call(createSaga(TAGS.GET, 'get', 'tags?limit=:limit', takeLatest, true, null, id)),
        call(createSaga(VARIANTS.GET, 'get', 'graphics?variants=:ids', takeLatest, false, id, response => {
            return response.map(variant => {
                return {
                    id: variant.variant_id,
                    graphic_id: variant.graphic_id,
                    title: variant.variant_title,
                    graphic_title: variant.graphic_title,
                    braille_format: variant.braille_format,
                    braille_no_of_pages: variant.braille_no_of_pages,
                    graphic_format: variant.graphic_format,
                    system: variant.system,
                    graphics_no_of_pages: variant.graphics_no_of_pages,
                    file_name: variant.file_name,
                    created_at: variant.created_at,
                    description: variant.variant_description
                }
            });
        })),
        call(createSaga(GRAPHIC.CREATE, 'post', 'graphics', takeLatest, true, id)),
        call(createSaga(ORDER.QUOTE, 'post', 'orders/quote', takeLatest, false, id)),
        call(createSaga(GRAPHIC.GET, 'get', 'graphics/:id', takeLatest, false, id, id)),
        call(createSaga(ADDRESS.GET, 'get', 'users/addresses', takeLatest, true, id, id)),
        call(createSaga(ADDRESS.CREATE, 'post', 'users/addresses', takeLatest, true, id, id)),
        call(createSaga(ADDRESS.REMOVE, 'post', 'users/addresses/delete/:id', takeLatest, true, id, id)),
        call(createSaga(ORDER.CREATE, 'post', 'orders', takeLatest, true, id, id, ['catalogue', 'basket'])),

        call(addressRemoveSaga),

        call(variantGetSaga),
        call(openFileWatcher),
        call(catalogueSearchSaga),
        call(variantUpdateSaga),
        call(variantCreateSaga),
        call(localstorageWatcher),
        call(searchChangeWatcher),

        call(logoutWatcher),
        call(userLoginSaga),
        call(userValidateSaga),
        call(userCreateSaga),

        call(labelWriteWatcher),
        call(contentEditWatcher),
        call(systemChangeWatcher),
        call(layoutEditWatcher),

        call(tagToggledWatcher),
        call(formatToggledWatcher),
        call(systemToggledWatcher),

        call(renderWatcher)
    ])
}

