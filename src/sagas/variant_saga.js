import createSaga from "./saga_utilities";
import {GRAPHIC, VARIANT} from "../actions/action_constants";
import {takeLatest} from "redux-saga/effects";
import {extractSVG} from "../components/editor/ReactSVG";

export const variantGetSaga = createSaga(
    VARIANT.GET, 'get', 'variants/:id', takeLatest, true, undefined,
    variant => {
        const deserializedDocument = JSON.parse(variant.current_version.document);
        return {
            variant_id: variant.id,
            graphic_id: variant.parent_graphic.id,
            version_id: variant.current_version.id,
            variantTitle: variant.title,
            variantDescription: variant.description,
            graphicTitle: variant.parent_graphic.title,
            derivedFrom: variant.derived_from,
            graphicDescription: variant.parent_graphic.description,
            tags: variant.tags,
            system: variant.braille_system,
            lastVersionHash: variant.current_version.hash,
            pages: deserializedDocument.pages,
            braillePages: deserializedDocument.braillePages,
            keyedTextures: deserializedDocument.keyedTextures,
            keyedStrokes: deserializedDocument.keyedStrokes
        };
    }
);

const isUuid = string => /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(string)

const replaceTagUuids = tags => tags.map(tag =>
    ({
        name: tag.name,
        tag_id: isUuid(tag.tag_id) ? null : tag.tag_id
    })
)

export const variantUpdateSaga = createSaga(
    VARIANT.UPDATE, 'post', 'variants/:variant_id', takeLatest, true, file =>
        ({
            ...file,
            tags: replaceTagUuids(file.tags),
            pages: file.pages.map((page, index) => (page.text ? {...page} : {...page, rendering: extractSVG(index)}))
        })
    );

export const variantCreateSaga = createSaga(
    VARIANT.CREATE, 'post', 'variants', takeLatest, true, file =>
        ({
            ...file,
            tags: replaceTagUuids(file.tags)
        }));

export const graphicCreateSaga = createSaga(GRAPHIC.CREATE, 'post', 'graphics', takeLatest, true, file =>
    ({
        ...file,
        tags: replaceTagUuids(file.tags)
    }));