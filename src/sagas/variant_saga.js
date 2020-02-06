import createSaga from "./saga_utilities";
import {VARIANT} from "../actions/constants";
import {takeLatest} from "@redux-saga/core/effects";

export const variantGetSaga = createSaga(
    VARIANT.GET, 'get', 'variants/:id', takeLatest, true,
    variant => {
        return {
            variant_id: variant.id,
            graphic_id: variant.graphic_id,
            version_id: variant.current_version.id,
            lastVersionHash: variant.current_version.hash,
            pages: JSON.parse(variant.current_version.document)
        };
    }
);