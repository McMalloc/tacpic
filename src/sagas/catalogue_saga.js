import {put, takeLatest, select} from "redux-saga/effects";
import {CATALOGUE, LOAD_MORE} from "../actions/action_constants";
import createSaga from "./saga_utilities";
import { groupBy } from "lodash";
import i18n from 'i18next';

const mapGraphics = graphics => {
    let groupedGraphics = groupBy(graphics, 'graphic_id');
    let mappableGraphics = [];
    // the API delivers a join table, so the redundant information can be mapped to a multilayer array
    for (let [graphic_id, variants] of Object.entries(groupedGraphics)) {
        mappableGraphics.push({
            title: groupedGraphics[graphic_id][0].graphic_title || i18n.t('catalogue:no_title'),
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

export const catalogueSearchSaga = createSaga(
    CATALOGUE.SEARCH, 'get',
    'graphics?tags=:tags&search=:terms&system=:system&format=:format&limit=:limit&offset=:offset',
    takeLatest, false, undefined, graphics => ({graphics: mapGraphics(graphics), count: graphics.length})
);

export const catalogueLoadMoreSaga = createSaga(
    CATALOGUE.MORE, 'get',
    'graphics?tags=:tags&search=:terms&system=:system&format=:format&limit=:limit&offset=:offset',
    takeLatest, false, request => request, graphics => ({graphics: mapGraphics(graphics), count: graphics.length})
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
            offset: 0, // offset needs to be reseted
            order_by: "date",
            order_desc: false
        }
    }
};

const catalogueLoadMore = catalogue => {
    return {
        type: CATALOGUE.MORE.REQUEST,
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

export function* searchChangeWatcher() {
    yield takeLatest(['SEARCH_CHANGED', 'TAG_TOGGLED', 'FORMAT_TOGGLED', 'SYSTEM_TOGGLED', LOAD_MORE], function* (action) {
        const catalogue = yield select(state => state.catalogue);
        if (action.type === LOAD_MORE) {
            yield put(catalogueLoadMore(catalogue));
        } else {
            yield put(catalogueSearch(catalogue));
        }
    })
}