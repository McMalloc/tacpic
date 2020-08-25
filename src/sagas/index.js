import {
    logoutWatcher,
    userCreateSaga,
    userLoginSaga,
    userLogoutSaga,
    userValidateSaga,
    userVerifySaga
} from "./user_saga";
import {call, all, takeLatest} from "redux-saga/effects";
import localstorageWatcher from "./localstorage_saga";
import {
    variantUpdateSaga,
    variantGetSaga,
    variantCreateSaga, graphicCreateSaga
} from "./variant_saga";
import {openFileWatcher} from "./file_saga";
import {
    TAGS,
    GRAPHIC,
    VARIANTS,
    ADDRESS,
    APP, QUOTE
} from "../actions/action_constants";
import createSaga from "./saga_utilities";
import {
    searchChangeWatcher,
    catalogueSearchSaga, catalogueLoadMoreSaga
} from "./catalogue_saga";
import {contentEditWatcher, labelWriteWatcher, layoutEditWatcher, systemChangeWatcher} from "./label_translate_saga";
import {renderWatcher} from "./render_saga";
import {addressRemoveSaga} from "./address_saga";
import {basketChangeSaga} from "./basket_saga";
import {orderCreateSaga, orderIndexSaga} from "./order_saga";

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
        call(createSaga(QUOTE.REQUEST, 'post', 'quotes/request', takeLatest, true, id, id)),
        call(createSaga(QUOTE.GET, 'post', 'quotes', takeLatest, false, id, id)),

        call(createSaga(GRAPHIC.GET, 'get', 'graphics/:id', takeLatest, false, id, id)),

        call(createSaga(ADDRESS.GET, 'get', 'users/addresses', takeLatest, true, id, id)),
        call(createSaga(ADDRESS.CREATE, 'post', 'users/addresses', takeLatest, true, id, id)),
        call(createSaga(ADDRESS.UPDATE, 'post', 'users/addresses/:id', takeLatest, true, id, id)),
        call(createSaga(ADDRESS.REMOVE, 'post', 'users/addresses/inactivate/:id', takeLatest, true, id, id)),
        call(addressRemoveSaga),

        call(orderCreateSaga),
        call(orderIndexSaga),

        call(createSaga(APP.FRONTEND, 'get', 'FRONTEND.json', takeLatest, false, id, id)),
        call(createSaga(APP.BACKEND, 'get', 'BACKEND.json', takeLatest, false, id, id)),

        call(basketChangeSaga),

        call(catalogueSearchSaga),
        call(catalogueLoadMoreSaga),
        call(searchChangeWatcher),

        call(variantGetSaga),
        call(openFileWatcher),
        call(variantUpdateSaga),
        call(variantCreateSaga),
        call(graphicCreateSaga),
        call(localstorageWatcher),

        call(logoutWatcher),
        call(userLoginSaga),
        call(userValidateSaga),
        call(userCreateSaga),
        call(userVerifySaga),

        call(labelWriteWatcher),
        call(contentEditWatcher),
        call(systemChangeWatcher),
        call(layoutEditWatcher),

        // call(tagToggledWatcher),
        // call(formatToggledWatcher),
        // call(systemToggledWatcher),

        call(renderWatcher),
    ])
}

