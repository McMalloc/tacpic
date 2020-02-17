import {CATALOGUE, VERSION, TAGS} from '../actions/constants';

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
        default:
            return state;
    }
};

export default catalogueApi