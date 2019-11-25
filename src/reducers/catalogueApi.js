import {CATALOGUE} from '../actions/constants';

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
        default:
            return state;
    }
};

export default catalogueApi