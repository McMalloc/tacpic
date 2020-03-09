import {put, race, take, takeLatest, select, takeMaybe, fork} from "redux-saga/effects";
import {CATALOGUE} from "../actions/constants";
import createSaga from "./saga_utilities";
import {groupBy} from "lodash";

export const catalogueSearchSaga = createSaga(
    CATALOGUE.SEARCH, 'get', 'graphics?tags=:tags&search=:terms&limit=:limit&offset=:offset', takeLatest, true, undefined,
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
                        system: variant.system,
                        width: variant.width,
                        height: variant.height,
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
            limit: catalogue.limit,
            offset: catalogue.offset,
            order_by: "date",
            order_desc: false
        }
    }
};

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