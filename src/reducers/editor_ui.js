import {cloneDeep} from "lodash"
import layouts from "../components/editor/widgets/layouts.js"
import {VERSION} from "../actions/constants";

let lastMode = 'label'; //TODO vereinheitlichen zu lastStateBeforeTransform oder so
let lastObjectsProps = [];

// TODO Monster-Reducer refaktorisieren

const ui = (state = {}, action) => {
    let oldState, mouseCoords;
    switch (action.type) {
        case 'TRANSFORM_START':
            lastMode = state.mode;
            return {...state, mode: action.transform};
        case 'CLAMP_START':
            return {...state, clamping: true};
        case 'CLAMP_END':
            return {...state, clamping: false};
        case 'OBJECT_SELECTED':
            let selectedObjects = action.uuid === null ? [] : [action.uuid];
            return {...state, selectedObjects};
        case 'TRANSFORM_END':
            return {...state, mode: lastMode};
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
        case 'ADD_BACKGROUND':
            return {...state, openedFile: {
                    ...state.openedFile,
                    backgroundURL: action.filename
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
        case 'LAYOUT_SET':
            //TODO da es ein Nebeneffekt ist und sogar blockt, sollte es auch eine Saga werden, die dann wiederum die eigentlich Action,
            // die die render props beeinflusst abfeuert
            const fromLS = JSON.parse(localStorage.getItem("custom_layout_" + action.layoutIndex));
            return {
                ...state,
                currentLayout: action.layoutIndex,
                widgetConfig: fromLS !== null ? fromLS : layouts[action.layoutIndex]
            };
        case 'WIDGET_VISIBILITY_TOGGLED':
            return {
                ...state,
                widgetConfig: state.widgetConfig.map(widget => {
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
        default:
            return state;
    }
};

export default ui