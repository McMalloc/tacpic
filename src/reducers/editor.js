import {cloneDeep, filter, every, find} from "lodash"
import layouts from "../components/editor/widgets/layouts.js"

let lastMode = 'label'; //TODO vereinheitlichen zu lastStateBeforeTransform oder so
let lastObjectsProps = [];

// todo Monster-Reducer refaktorisieren

const editor = (state = {}, action) => {
    let objects, oldState;

    switch (action.type) {
        case 'TRANSFORM_START':
            lastMode = state.mode;
            return {...state, mode: action.transform};

        case 'CLAMP_START':
            return {...state, clamping: true};
        case 'CLAMP_END':
            return {...state, clamping: false};

        case 'OBJECT_ADDED':
            oldState = cloneDeep(state);
            oldState.openedFile.pages[state.currentPage].objects.push(action.object);

            return oldState;

        case 'OBJECT_SELECTED':
            let selectedObjects = action.uuid === null ? [] : [action.uuid];
            return {...state, selectedObjects};

        case 'OBJECT_ROTATED':
            // TODO ordentliche Rotation
            objects = [...state.openedFile.pages[state.currentPage].objects]; // TODO effizienter bei TRANSFORM_START

            filter(objects, {uuid: state.selectedObjects[0]}).forEach(object => {
                let angle = Math.sqrt(Math.pow(action.coords.x1 - action.coords.x0, 2) + Math.pow(action.coords.y1 - action.coords.y0, 2));
                object.angle = angle;
                object.pattern.angle = -angle; //todo Nur einmalig setzen und in der Komponenten weiterreichen bzw. umrechnen.
            });
            return {...state, objects};

        case 'OBJECT_TRANSLATED':
            // TODO sauberer für nested objects
            // TODO Idee: statt tatsächliches Objekt immer wieder während des Verschiebens neu zu rendern, die Browser-native <img> drag and drop Vorschau anzeigen
            oldState = {...state};
            objects = oldState.openedFile.pages[state.currentPage].objects;

            if (lastObjectsProps.length === 0) {
                every(filter(objects, {uuid: state.selectedObjects[0]}), (object, index) => {
                    // console.log(object);
                    lastObjectsProps[index] = {};
                    lastObjectsProps[index].x = object.x;
                    lastObjectsProps[index].y = object.y;
                });
            }

            filter(objects, {uuid: state.selectedObjects[0]}).forEach((object, index) => {
                object.x = lastObjectsProps[index].x + action.coords.x1 - action.coords.x0;
                object.y = lastObjectsProps[index].y + action.coords.y1 - action.coords.y0;
            });

            return oldState;
        case 'TRANSFORM_END':
            lastObjectsProps = [];
            return {...state, mode: lastMode};

        case 'OBJECT_PROP_CHANGED':
            console.log(action);
            oldState = cloneDeep(state);
            filter(oldState.openedFile.pages[oldState.currentPage].objects, {uuid: action.uuid}).forEach(object => {
                object[action.prop] = action.value;

                if (action.prop === "isKey" && object.keyVal === '') {
                    object.keyVal = object.text.slice(0, 3);
                }
            });

            return oldState;
        case 'VERTICAL_SPACING_SET':
            return {...state, verticalGridSpacing: action.spacing};
        case 'HORIZONTAL_SPACING_SET':
            return {...state, horizontalGridSpacing: action.spacing};
        case 'VERTICAL_SPACING_TOGGLE':
            console.log(action.payload);
            return {...state, showVerticalGrid: action.payload};
        case 'HORIZONTAL_SPACING_TOGGLE':
            return {...state, showHorizontalGrid: action.state};
        case 'DEFAULT_TITLE_TOGGLE':
            return {...state, defaultTitle: action.state};
        case 'CHANGE_TITLE':
            return {...state, openedFile: {
                    ...state.openedFile,
                    title: action.title
                }};
        case 'CHANGE_CATALOGUE_TITLE':
            return {...state, openedFile: {
                    ...state.openedFile,
                    catalogueTitle: action.title
                }};
        case 'SWITCH_CURSOR_MODE':
            return {...state, mode: action.mode};
        case 'SWITCH_TEXTURE_MODE':
            return {...state, texture: action.mode};
        case 'SWITCH_FILL_MODE':
            return {...state, fill: action.colour};
        case 'PATTERNS_INIT_DONE':
            return {...state, initialized: true};
        case 'PAGE_CHANGE':
            return {...state, selectedObjects: [], currentPage: action.number};
        case 'PAGE_ADD':
            let openedFile = {...state.openedFile};
            openedFile.pages.push({name: 'Seite ' + (openedFile.pages.length + 1), objects: []});
            return {...state, openedFile};
        case 'LAYOUT_SET':
            //TODO da es ein Nebeneffekt ist und sogar blockt, sollte es auch eine Saga werden, die dann wiederum die eigentlich Action,
            // die die render props beeinflusst abfeuert
            const fromLS = JSON.parse(localStorage.getItem("custom_layout_" + action.layoutIndex));
            return {
                ...state,
                currentLayout: action.layoutIndex,
                widgetConfig: fromLS !== null ? fromLS : layouts[action.layoutIndex]
            };
        case 'LAYOUT_CHANGED': // TODO: wird das noch benutzt?
            // löst einen Effekt aus
            return {
                ...state
            };
        case 'WIDGET_VISIBILITY_TOGGLED':
            return {
                ...state,
                widgetConfig: state.widgetConfig.map(widget => {
                    console.log(widget);
                    if (widget.i !== action.id) {
                        return widget;
                    } else {
                        widget.visible = action.state;
                        return widget;
                    }
                })

            };
        case 'KEY_TEXTURE_ADDED':
            oldState = cloneDeep(state);
            console.log(action.label);
            oldState.openedFile.keyedTextures[action.texture] = action.label;
            return oldState;
        case 'CACHE_SVG':
            let file = {...state.openedFile};
            file.pages[action.pageNumber].cache = action.markup;
            return {
                ...state,
                openedFile: file
            };
        default:
            return state;
    }
};

export default editor
// export default editor