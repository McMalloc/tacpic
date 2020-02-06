import {CATALOGUE, VERSION} from '../actions/constants';
import {groupBy} from 'lodash';

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
        default:
            return state;
    }
};

export default catalogueApi