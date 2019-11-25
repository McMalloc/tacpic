import {cloneDeep, filter, every, includes} from "lodash"
import {VERSION} from "../actions/constants";
import transformations from "./transformations";

let lastMode = 'label'; //TODO vereinheitlichen zu lastStateBeforeTransform oder so

const file = (state = {}, action) => {
    let objects, oldState;
    switch (action.type) {
        case 'OBJECT_ADDED':
            oldState = {...state};
            oldState.pages[action.currentPage].objects.push(action.object);

            return oldState;
        case 'OBJECT_ROTATED':
            oldState = {...state};

            oldState.pages[action.currentPage].objects.forEach(object => { // refactor selective function
                if (!includes(action.uuids, object.uuid)) return;

                transformations.rotate[object.type](
                    object,
                    action.coords.originX,
                    action.coords.originY,
                    action.coords.offsetX,
                    action.coords.offsetY
                );
            });

            return oldState;
        case 'OBJECT_TRANSLATED':
            // TODO sauberer für nested objects
            oldState = {...state};

            oldState.pages[action.currentPage].objects.forEach(object => {
                if (!includes(action.uuids, object.uuid)) return;
                transformations.translate[object.type](object, action.coords.x, action.coords.y);
            });

            return oldState;
        case 'OBJECT_SCALED':
            // TODO sauberer für nested objects
            // TODO Idee: statt tatsächliches Objekt immer wieder während des Verschiebens neu zu rendern, die Browser-native <img> drag and drop Vorschau anzeigen


            return oldState;
        case 'OBJECT_PROP_CHANGED':
            console.log(action);
            oldState = cloneDeep(state);
            filter(oldState.pages[action.currentPage].objects, {uuid: action.uuid}).forEach(object => {
                object[action.prop] = action.value;

                if (action.prop === "isKey" && object.keyVal === '') {
                    object.keyVal = object.text.slice(0, 3);
                }
            });

            return oldState;
        case 'CHANGE_TITLE':
            return {...state, file: {
                    ...state,
                    title: action.title
                }};
        case 'CHANGE_CATALOGUE_TITLE':
            return {...state, file: {
                    ...state,
                    catalogueTitle: action.title
                }};
        case 'CHANGE_CATEGORY':
            return {...state, file: {
                    ...state,
                    category: action.catID
                }};
        case 'PAGE_ADD':
            oldState = {...state};
            oldState.pages.push({name: 'Seite ' + (oldState.pages.length + 1), objects: []});
            return {...state, file};
        case 'CACHE_SVG':
            oldState = {...state};
            oldState.pages[action.pageNumber].cache = action.markup;
            return {
                ...state,
                file: oldState
            };
        default:
            return state;
    }
};

export default file