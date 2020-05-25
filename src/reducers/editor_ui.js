import {cloneDeep} from "lodash"
import layouts from "../components/editor/widgets/layouts.js"
import {VERSION, VARIANT} from "../actions/constants";

let lastMode = 'label'; //TODO vereinheitlichen zu lastStateBeforeTransform oder so
let lastObjectsProps = [];
const roundingAccuracy = 10;

// TODO Monster-Reducer refaktorisieren

const ui = (state = {}, action) => {
    let oldState, mouseCoords;
    switch (action.type) {
        case 'TRANSFORM_START':
            lastMode = state.mode;
            return {...state, mode: action.transform};
        case 'OBJECT_SELECTED':
            let uuids;
            if (!(action.uuids instanceof Array)) { // selected single object
                uuids = [action.uuids]
            } else {uuids = action.uuids}
            let selectedObjects = uuids[0] === null ? [] : uuids;
            return {...state, selectedObjects};
        case 'TRANSFORM_END':
            return {...state, mode: lastMode};
        case 'CHANGE_VIEWPORT':
            let scalingFactor = action.scalingFactor < 0.05 ? 0.1 :
                Math.round(action.scalingFactor * roundingAccuracy) / roundingAccuracy; // regain accuracy from wonky javascript rounding
            return {...state,
                scalingFactor,
                viewPortX: action.viewPortX,
                viewPortY: action.viewPortY
            };
        case 'VERTICAL_SPACING_SET':
            return {...state, verticalGridSpacing: action.spacing};
        case 'HORIZONTAL_SPACING_SET':
            return {...state, horizontalGridSpacing: action.spacing};
        case 'VERTICAL_SPACING_TOGGLE':
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
            return {...state, tool: action.mode.toUpperCase()};
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
                previewMode: action.layoutIndex === 8,
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
        default:
            return state;
    }
};

export default ui