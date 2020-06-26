import {put, race, take, takeLatest, select, takeMaybe, fork} from "redux-saga/effects";
import {CATALOGUE} from "../actions/action_constants";
import createSaga from "./saga_utilities";
import {groupBy} from "lodash";

export const catalogueSearchSaga = createSaga(
    CATALOGUE.SEARCH, 'get',
    'graphics?tags=:tags&search=:terms&system=:system&format=:format&limit=:limit&offset=:offset',
    takeLatest, true, undefined,
    graphics => {
        let groupedGraphics = groupBy(graphics, 'graphic_id');
        let mappableGraphics = [];
        // the API delivers a join table, so the redundant information can be mapped to a multilayer array
        for (let [graphic_id, variants] of Object.entries(groupedGraphics)) {
            mappableGraphics.push({
                title: groupedGraphics[graphic_id][0].graphic_title || 'Ohne Titel',
                description: groupedGraphics[graphic_id][0].graphic_description || '',
                user_id: groupedGraphics[graphic_id][0].original_author_id || '',
                id: graphic_id,
                variants: variants.map(variant => {
                    return {
                        id: variant.variant_id,
                        title: variant.variant_title,
                        file_name: variant.file_name,
                        braille_format: variant.braille_format,
                        braille_no_of_pages: variant.braille_no_of_pages,
                        graphic_format: variant.graphic_format,
                        graphics_no_of_pages: variant.graphics_no_of_pages,
                        created_at: variant.created_at,
                        description: variant.variant_description,
                        tags: variant.tags === "{NULL}" ?
                            [] : variant.tags.match(/\d+/g).map(id => parseInt(id))
                    };
                })
            });
        }
        return mappableGraphics;
    }
);

const catalogueSearch = catalogue => {
    return {
        type: CATALOGUE.SEARCH.REQUEST,
        payload: {
            tags: catalogue.filterTags,
            terms: catalogue.filterTerms,
            system: catalogue.filterSystem,
            format: catalogue.filterFormat,
            limit: catalogue.limit,
            offset: catalogue.offset,
            order_by: "date",
            order_desc: false
        }
    }
};


// TODO ein watcher genügt vermutlich, doch mit welchem effect/channel?
export function* searchChangeWatcher() {
    yield takeLatest('SEARCH_CHANGED', function* (action) {
        const catalogue = yield select(state => state.catalogue);
        yield put(catalogueSearch(catalogue));
    })
}

export function* tagToggledWatcher() {
    yield takeLatest('TAG_TOGGLED', function* (action) {
        const catalogue = yield select(state => state.catalogue);
        yield put(catalogueSearch(catalogue));
    });
}

export function* formatToggledWatcher() {
    yield takeLatest('FORMAT_TOGGLED', function* (action) {
        const catalogue = yield select(state => state.catalogue);
        yield put(catalogueSearch(catalogue));
    });
}

export function* systemToggledWatcher() {
    yield takeLatest('SYSTEM_TOGGLED', function* (action) {
        const catalogue = yield select(state => state.catalogue);
        yield put(catalogueSearch(catalogue));
    });
}