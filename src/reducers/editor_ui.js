import { COPY, FILE, IMPORT, SUPPRESS_BACKUP } from "../actions/action_constants";

let lastMode = 'label'; //TODO vereinheitlichen zu lastStateBeforeTransform oder so
const roundingAccuracy = 10;

// TODO Monster-Reducer refaktorisieren

const ui = (state = {}, action) => {
    switch (action.type) {
        case FILE.OPEN.REQUEST:
            return { ...state, fileOpen: 1 };
        case FILE.OPEN.SUCCESS:
            return { ...state, currentPage: 0, fileOpen: 2 };
        case FILE.OPEN.FAILURE:
            return { ...state, fileOpen: 3 };

        case 'IMPORT_TRACE_RESET':
            return { ...state,
                import: { preview: null, ocr: [], ocrSelection: [], previewName: '' } };

        case IMPORT.TRACE.REQUEST:
            return {
                ...state, import: {
                    ocrSelection: [],
                    pending: true, preview: null, ocr: '',
                    previewName: action.payload.get('image').name.replace(/(.*)\.[^.]+$/, '$1'),
                    error: null
                }
            };
        case IMPORT.TRACE.SUCCESS:
            return {
                ...state,
                import: {
                    ...state.import,
                    pending: false,
                    preview: action.data.graphic,
                    ocr: action.data.ocr.split('\n').filter(label => label.trim().length !== 0),
                    error: null
                }
            };
        case IMPORT.TRACE.FAILURE:
            return { ...state, import: { pending: false, preview: null, ocr: [], error: action.message, previewName: '' } };

        case COPY:
            return {
                ...state, clipboard: action.objects
            }
        case 'OCR_SELECT':
            return {
                ...state,
                import: { ...state.import, ocrSelection: action.selection }
            };

        case 'TRANSFORM_START':
            lastMode = state.mode;
            return { ...state, mode: action.transform };
        case 'OBJECT_SELECTED':
            let uuids;
            if (!(action.uuids instanceof Array)) { // selected single object
                uuids = [action.uuids]
            } else {
                uuids = action.uuids
            }
            let selectedObjects = uuids[0] === null ? [] : uuids;
            return { ...state, selectedObjects };
        case 'TRANSFORM_END':
            return { ...state, mode: lastMode };
        case 'CHANGE_VIEWPORT':
            let scalingFactor = action.scalingFactor < 0.5 ? 0.5 :
                Math.round(action.scalingFactor * roundingAccuracy) / roundingAccuracy; // regain accuracy from wonky javascript rounding
            return {
                ...state,
                scalingFactor,
                viewPortX: action.viewPortX,
                // viewPortX: Math.max(Math.min(50, action.viewPortX), -1000),
                viewPortY: action.viewPortY
                // viewPortY: Math.max(Math.min(50, action.viewPortY), -1400)
            };
        case 'VERTICAL_SPACING_SET':
            return { ...state, verticalGridSpacing: action.spacing };
        case 'HORIZONTAL_SPACING_SET':
            return { ...state, horizontalGridSpacing: action.spacing };
        case 'VERTICAL_SPACING_TOGGLE':
            return { ...state, showVerticalGrid: action.payload };
        case 'HORIZONTAL_SPACING_TOGGLE':
            return { ...state, showHorizontalGrid: action.state };
        case 'DEFAULT_TITLE_TOGGLE':
            return { ...state, defaultTitle: action.state };
        case 'SAFE_AREA_TOGGLE':
            return { ...state, showSafeArea: action.state };
        case 'ADD_BACKGROUND':
            return {
                ...state, openedFile: {
                    ...state.openedFile,
                    backgroundURL: action.filename
                }
            };
        case 'SWITCH_CURSOR_MODE':
            return { ...state, tool: action.mode.toUpperCase() };
        case 'SWITCH_TEXTURE_MODE':
            return { ...state, texture: action.mode };
        case 'SWITCH_FILL_MODE':
            return { ...state, fill: action.colour };
        case 'PATTERNS_INIT_DONE':
            return { ...state, initialized: true };
        case 'PAGE_CHANGE':
            return { ...state, selectedObjects: [], currentPage: action.number };
        default:
            return state;
    }
};

export default ui