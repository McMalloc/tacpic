import createSaga from "./saga_utilities";
import {GRAPHIC, VARIANT} from "../actions/action_constants";
import {takeLatest} from "redux-saga/effects";
import {extractSVG} from "../components/editor/ReactSVG";
import { determineDimensions } from "../utility/determineFormat";

export const variantGetSaga = createSaga(
    VARIANT.GET, 'get', 'variants/:id', takeLatest, true, undefined,
    variant => {
        const deserializedDocument = JSON.parse(variant.current_version.document);
        const {width, height} = determineDimensions(variant.graphic_format, variant.graphic_landscape);
        console.log(width, height);
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
            width, height,
            lastVersionHash: variant.current_version.hash,
            pages: deserializedDocument.pages,
            braillePages: deserializedDocument.braillePages,
            keyedTextures: deserializedDocument.keyedTextures,
            keyedStrokes: deserializedDocument.keyedStrokes
        };
    }
);

// newly added tags need a temporary identifier (uuid) to avoid duplicates
// the uuid are replaced with null before they are send to the server.
// the server will then create new tags if the id is null
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
            variantDescription: `${file.braillePages.imageDescription.type}. ${file.braillePages.imageDescription.summary} ${file.braillePages.imageDescription.details}`,
            tags: replaceTagUuids(file.tags),
            // hash: md5(JSON.stringify(file.pages.map(page=>{
            //     delete page.rendering;
            //     return page;
            // }))),
            pages: file.pages.map((page, index) => ({...page, rendering: extractSVG(index)}))
        })
    );

export const variantCreateSaga = createSaga(
    VARIANT.CREATE, 'post', 'variants', takeLatest, true, file =>
        ({
            ...file,
            variantDescription: `${file.braillePages.imageDescription.summary} (${file.braillePages.imageDescription.type})`,
            tags: replaceTagUuids(file.tags)
        }));

export const graphicCreateSaga = createSaga(GRAPHIC.CREATE, 'post', 'graphics', takeLatest, true, file =>
    ({
        ...file,
        variantDescription: `${file.braillePages.imageDescription.summary} (${file.braillePages.imageDescription.type})`,
        tags: replaceTagUuids(file.tags)
    }));