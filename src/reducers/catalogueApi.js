import {CATALOGUE, VERSION, TAGS, GRAPHIC} from '../actions/constants';
import {createReducer} from "./index";

// let catalogueApiCallbacks = {};
// createReducer(GRAPHIC.GET, catalogueApiCallbacks);
//
// export function catalogueApiReducer(state = {}, action) {
//     !!catalogueApiCallbacks[action.type] && catalogueApiCallbacks[action.type]()
// }

const catalogueApi = (state = {}, action) => {
    switch (action.type) {
        case CATALOGUE.SEARCH.REQUEST:
            return {
                ...state,
                limit: action.payload.limit,
                offset: action.payload.offset
            };
        case CATALOGUE.SEARCH.SUCCESS:
            return {
                ...state, graphics: action.data
            };
        case CATALOGUE.SEARCH.FAILURE:
            return {
                ...state
            };

        case GRAPHIC.GET.REQUEST:
            return {
                ...state,
                graphicGetPending: true
            };
        case GRAPHIC.GET.SUCCESS:
            return {
                ...state,
                graphicGetPending: false,
                viewedGraphic: action.data
            };
        case GRAPHIC.GET.FAILURE:
            return {
                ...state,
            };

        case VERSION.GET.REQUEST:
            return {
                ...state
            };
        case VERSION.GET.SUCCESS:
            return {
                ...state, graphics: action.data
            };
        case VERSION.GET.FAILURE:
            return {
                ...state
            };
        case TAGS.GET.SUCCESS:
            return {
                ...state,
                tags: action.data
            };
        case 'TAG_TOGGLED':
            const tagIndex = state.filterTags.indexOf(action.id);
            let filterTags = [...state.filterTags];

            if (tagIndex === -1) {
                filterTags.push(action.id)
            } else {
                filterTags.splice(tagIndex, 1);
            }
            return {
              ...state,
              filterTags
            };
        case 'FORMAT_TOGGLED':
            const formatIndex = state.filterFormat.indexOf(action.format);
            let filterFormat = [...state.filterFormat];

            if (formatIndex === -1) {
                filterFormat.push(action.format)
            } else {
                filterFormat.splice(formatIndex, 1);
            }
            return {
              ...state,
                filterFormat
            };
        case 'SYSTEM_TOGGLED':
            const systemIndex = state.filterSystem.indexOf(action.system);
            let filterSystem = [...state.filterSystem];

            if (systemIndex === -1) {
                filterSystem.push(action.system)
            } else {
                filterSystem.splice(systemIndex, 1);
            }
            return {
              ...state,
                filterSystem
            };
        case 'SEARCH_CHANGED':
            return {
                ...state,
                filterTerms: action.value
            };
        default:
            return state;
    }
};

export default catalogueApi