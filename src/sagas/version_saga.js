import {takeLatest, takeEvery, call, put} from 'redux-saga/effects';
import {VERSION, CATALOGUE} from "../actions/constants";
import axios from "axios/index";
import uri_encode from "../utility/uri_encode";
import createSaga from "./saga_utilities";
import {groupBy} from "lodash";


export const versionGetSaga = createSaga(
    VERSION.GET, 'get', 'users/versions', takeLatest, true,
    graphics => {
            let groupedGraphics = groupBy(graphics, 'graphic_id');
            let mappableGraphics = [];
            for (let [graphic_id, variants] of Object.entries(groupedGraphics)) {
                let groupedVariants = groupBy(variants, 'variant_id');
                let mappableVariants = [];

                for (let [variant_id, versions] of Object.entries(groupedVariants)) {
                    mappableVariants.push({
                        title: versions[0].variant_title || 'Ohne Titel',
                        id: variant_id,
                        versions: versions
                    })
                }

                mappableGraphics.push({
                    title: variants[0].graphic_title || 'Ohne Titel',
                    id: graphic_id,
                    variants: mappableVariants
                });
            }
            return mappableGraphics;
        }
    );

export const versionCreateSaga = createSaga(
    VERSION.CREATE, 'post', 'versions', takeLatest, true);



