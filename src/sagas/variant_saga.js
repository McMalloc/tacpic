import createSaga from "./saga_utilities";
import {VARIANT} from "../actions/constants";
import {takeLatest} from "redux-saga/effects";

export const variantGetSaga = createSaga(
    VARIANT.GET, 'get', 'variants/:id', takeLatest, true,
    variant => {
        return {
            variant_id: variant.id,
            graphic_id: variant.parent_graphic.id,
            version_id: variant.current_version.id,
            variantTitle: variant.title,
            variantDescription: variant.description,
            graphicTitle: variant.parent_graphic.title,
            graphicDescription: variant.parent_graphic.description,
            tags: variant.tags,
            lastVersionHash: variant.current_version.hash,
            pages: JSON.parse(variant.current_version.document)
        };
    }
);

export const variantUpdateSaga = createSaga(
    VARIANT.UPDATE, 'post', 'variants/:variant_id', takeLatest, true, file => {
        // file.renderPreview = document.getElementById("MAIN-CANVAS").outerHTML;
        return file;
    });

export const variantCreateSaga = createSaga(
    VARIANT.CREATE, 'post', 'variants', takeLatest, true, file => {
        // file.renderPreview = document.getElementById("MAIN-CANVAS").outerHTML;
        return file;
    });