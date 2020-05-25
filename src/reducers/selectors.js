import {filter, flatten, map, uniq} from "lodash";

export const patternsInUseSelector = state => {
    const allObjects = flatten(map(state.editor.file.pages, page => page.objects));
    return uniq(map(filter(allObjects, obj => !!obj && !!obj.pattern), objWithPattern => objWithPattern.pattern.template));
};