import {
    logoutWatcher,
    userCreateSaga,
    userLoginSaga, userResetRequestSaga, userResetSaga, userUpdateSaga,
    userValidateSaga,
    userVerifySaga
} from "./user_saga";
import {call, all, takeLatest} from "redux-saga/effects";
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
    VARIANT,
    ADDRESS,
    APP, QUOTE, IMPORT, CMS_PAGE, STATIC_PAGE, USER
} from "../actions/action_constants";
import createSaga from "./saga_utilities";
import {
    searchChangeWatcher,
    catalogueSearchSaga, catalogueLoadMoreSaga
} from "./catalogue_saga";
import {
    contentEditWatcher,
    labelWriteWatcher,
    layoutEditWatcher,
    ocrImportWatcher,
    systemChangeWatcher, textureKeyChangeWatcher
} from "./label_translate_saga";
import {renderWatcher} from "./render_saga";
import {addressRemoveSaga} from "./address_saga";
import {basketChangeSaga} from "./basket_saga";
import {orderCreateSaga, orderIndexSaga} from "./order_saga";
import {titleEditWatch} from "./title_saga";
import {backupNeededWatcher, backupWatcher} from "./backup_saga";
import { errorWatcher } from "./error_saga";

const id = args => args;

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
                    current_file_name: variant.current_file_name,
                    created_at: variant.created_at,
                    description: variant.variant_description,
                    derived_from: variant.derived_from
                }
            });
        })),
        call(createSaga(QUOTE.REQUEST, 'post', 'quotes/request', takeLatest, true, id, id)),
        call(createSaga(QUOTE.GET, 'post', 'quotes', takeLatest, false, id, id)),

        call(createSaga(GRAPHIC.GET, 'get', 'graphics/:id', takeLatest, false, id, id)),
        call(createSaga(VARIANT.HISTORY, 'get', 'variants/:id/history', takeLatest, false, id, id)),

        call(createSaga(CMS_PAGE.GET, 'get', 'cms/pages/:id', takeLatest, false, id, id)),
        call(createSaga(CMS_PAGE.INDEX, 'get', 'cms/pages', takeLatest, false, id, id)),

        call(createSaga(ADDRESS.GET, 'get', 'users/addresses', takeLatest, true, id, id)),
        call(createSaga(ADDRESS.CREATE, 'post', 'users/addresses', takeLatest, true, id, id)),
        call(createSaga(ADDRESS.UPDATE, 'post', 'users/addresses/:id', takeLatest, true, id, id)),
        call(createSaga(ADDRESS.REMOVE, 'post', 'users/addresses/inactivate/:id', takeLatest, true, id, id)),
        call(addressRemoveSaga),

        call(createSaga(IMPORT.TRACE, 'post', 'trace', takeLatest, false, id, id)),
        call(createSaga(IMPORT.OCR, 'post', 'ocr', takeLatest, false, id, id)),

        call(orderCreateSaga),
        call(orderIndexSaga),

        call(createSaga(APP.FRONTEND, 'get', 'FRONTEND.json', takeLatest, false, id, id)),
        call(createSaga(APP.LEGAL, 'get', 'legal/index', takeLatest, false, id, id)),
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
        call(backupWatcher),
        call(backupNeededWatcher),

        call(logoutWatcher),
        call(userLoginSaga),
        call(userValidateSaga),
        call(userCreateSaga),
        call(userUpdateSaga),
        call(userVerifySaga),
        call(userResetSaga),
        call(userResetRequestSaga),

        call(labelWriteWatcher),
        call(textureKeyChangeWatcher),
        call(titleEditWatch),
        call(contentEditWatcher),
        call(systemChangeWatcher),
        call(layoutEditWatcher),
        call(ocrImportWatcher),

        // call(tagToggledWatcher),
        // call(formatToggledWatcher),
        // call(systemToggledWatcher),

        call(renderWatcher),

        call(errorWatcher),
    ])
}

