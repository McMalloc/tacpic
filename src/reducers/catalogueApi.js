import {
    CATALOGUE,
    VERSION,
    TAGS,
    GRAPHIC,
    ORDER,
    VARIANTS,
    VARIANT,
    ITEM_ADDED_TO_BASKET,
    ITEM_REMOVED_FROM_BASKET, ORDER_RESET, QUOTE, CLEAR_BASKET, LOAD_MORE, ITEM_UPDATED_IN_BASKET
} from '../actions/action_constants';
import {produce} from "immer";

// let catalogueApiCallbacks = {};
// createReducer(GRAPHIC.GET, catalogueApiCallbacks);
//
// export function catalogueApiReducer(state = {}, action) {
//     !!catalogueApiCallbacks[action.type] && catalogueApiCallbacks[action.type]()
// }


const catalogueApi = (state = {}, action) => {
    switch (action.type) {
        case LOAD_MORE:
            return {
                ...state,
                offset: state.offset + state.limit
            };
        case CATALOGUE.MORE.REQUEST:
            return {
                ...state,
                loadMorePending: true
            };
        case CATALOGUE.MORE.SUCCESS:
            return {
                ...state, graphics: state.graphics.concat(action.data.graphics), exhausted: action.data.count < state.limit, loadMorePending: false
            };

        case CATALOGUE.SEARCH.REQUEST:
            return {
                ...state,
                limit: action.payload.limit,
                offset: action.payload.offset,
                searchPending: true
            };
        case CATALOGUE.SEARCH.SUCCESS:
            return {
                ...state, graphics: action.data.graphics, exhausted: action.data.count < state.limit, searchPending: false
            };
        case CATALOGUE.SEARCH.FAILURE:
            return {
                ...state,
                searchPending: false
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
        
        case VARIANT.HISTORY.REQUEST:
            return {
                ...state,
                historyPending: true
            };
        case VARIANT.HISTORY.SUCCESS:
            return {
                ...state,
                historyPending: false,
                currentHistory: action.data
            };
        case VARIANT.HISTORY.FAILURE:
            return {
                ...state,
                historyPending: false
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
        case VARIANTS.GET.SUCCESS: // TODO action beschreibt nicht, was sich im Store ändert
            return produce(state, draftState => {
                state.basket.forEach((item, index) => {
                    if (!action.data.find(v => v.id === item.contentId)) {
                        draftState.basket.splice(index, 1);
                    }
                });
                draftState.quotedVariants = action.data;
            });
        case QUOTE.GET.SUCCESS:
            return {
                ...state,
                quote: action.data
            };
        case QUOTE.REQUEST.REQUEST:
            return {
                ...state,
                quote: {
                    ...state.quote,
                    pending: true
                }
            };
        case QUOTE.REQUEST.SUCCESS:
            return {
                ...state,
                quote: {
                    ...state.quote,
                    pending: false,
                    successfull: true,
                    error: null
                }
            };
        case QUOTE.REQUEST.FAILURE:
            return {
                ...state,
                quote: {
                    ...state.quote,
                    pending: false,
                    successfull: false,
                    error: action.message
                }
            };
        case ORDER.CREATE.REQUEST:
            return {
                ...state,
                order: {
                    error: null,
                    pending: true,
                    successful: false,
                    key: action.payload.idempotencyKey
                }
            };
        case ORDER.CREATE.SUCCESS:
            return {
                ...state,
                basket: [],
                order: {
                    ...state.order,
                    pending: false,
                    successful: true
                }
            };
        case ORDER.CREATE.FAILURE:
            return {
                ...state,
                order: {
                    pending: false,
                    successful: false,
                    error: action.message || null
                }
            };
        case ORDER_RESET:
            return {
                ...state,
                order: {
                    pending: false,
                    key: null,
                    successful: false,
                    error: null
                }
            };
        case ITEM_REMOVED_FROM_BASKET:
            return produce(state, draftState => {
                draftState.basket.splice(action.index, 1);
            });
        case CLEAR_BASKET:
            return {
                ...state,
                basket: []
            }
        case ITEM_ADDED_TO_BASKET:
            return produce(state, draftState => {
                let isUpdate = false;
                state.basket.forEach((item, index) => {
                    if (draftState.basket[index].contentId === action.contentId) {
                        isUpdate = isUpdate || true;
                        draftState.basket[index].quantity += action.quantity;
                    }
                })

                if (!isUpdate) {
                    draftState.basket.push({
                        contentId: action.contentId,
                        productId: action.productId,
                        quantity: action.quantity,
                    })
                }
            });
        case ITEM_UPDATED_IN_BASKET:
            return produce(state, draftState => {
                state.basket.forEach((item, index) => {
                    if (action.index === index) {
                        draftState.basket[index].quantity = action.quantity; // TODO quantity 0 = remove
                        draftState.basket[index].contentId = action.contentId;
                        draftState.basket[index].productId = action.productId;
                    }
                })
            });
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