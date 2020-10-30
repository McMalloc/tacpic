import {filter, flatten, map, uniq} from "lodash";

export const patternsInUseSelector = state => {
    const allObjects = flatten(map(state.editor.file.present.pages, page => page.objects));
    return uniq(map(filter(allObjects, obj => !!obj && !!obj.pattern), objWithPattern => objWithPattern.pattern.template));
};

export const keyedLabelsSelector = state => {
    const allObjects = flatten(state.editor.file.present.pages.map(page => page.objects));
    return allObjects.filter(object => object && object.isKey).map(({braille, keyVal, text}) => ({
        keyVal,
        braille,
        text
    }));
}