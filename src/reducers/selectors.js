import {filter, flatten, map, uniq} from "lodash";

const allObjects = state => flatten(state.editor.file.present.pages.map(page => page.objects));

export const patternsInUseSelector = state => {
    return uniq(map(filter(allObjects(state), obj => !!obj && !!obj.pattern), objWithPattern => objWithPattern.pattern.template));
};

export const keySelector = state => {
    return allObjects(state).filter(obj => obj.type === 'key');
};

export const keyedLabelsSelector = state => {
    return allObjects(state).filter(object => object && object.isKey).map(({braille, keyVal, text, uuid}) => ({
        keyVal,
        uuid,
        braille,
        text
    }));
}