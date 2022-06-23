import { CMS_CATEGORY, CMS_LEGAL, CMS_PAGE, CMS_SEARCH, CMS_SEARCH_CLEAR } from '../actions/action_constants';
import produce from 'immer';


const cmsReducer = (state = {}, action) => {
    switch (action.type) {
        case CMS_CATEGORY.INDEX.SUCCESS:
            const categories = action.data;
            const rootNodes = categories.filter(cat => cat.parent === 0);

            const getNodes = node => {
                let result = { ...node }
                let children = categories.filter(cat => cat.parent === node.id);
                if (children.length > 0) {
                    result.children = children.map(child => getNodes(child))
                }
                return result;
            } // TODO extract method

            return {
                ...state,
                categories: {
                    ...state.categories,
                    index: action.data,
                    hierarchy: rootNodes.map(getNodes),
                    pending: false,
                    successful: true
                }
            }
        case CMS_CATEGORY.INDEX.FAILURE:
            return {
                ...state
            }
        case CMS_CATEGORY.INDEX.REQUEST:
            return {
                ...state,
                categories: {
                    ...state.categories,
                    pending: true
                }
            }

        case CMS_PAGE.INDEX.SUCCESS:
            return produce(state, draftState => {
                const pagesFromServer = action.data;
                const pages = [...state.pages];
                if (pages.length === 0) {
                    draftState.pages = pagesFromServer
                } else {
                    draftState.pages = pagesFromServer.map(pageFromServer => {
                        if (pages.map(p => p.id).includes(pageFromServer.id)) {
                            return pages.find(p => p.id === pageFromServer.id)
                        } else {
                            return pageFromServer
                        }
                    })
                }
                draftState.pagesPending = false;
                draftState.pagesSuccessfull = true;
                draftState.pagesError = null;
                return draftState;
            })

        case CMS_PAGE.INDEX.FAILURE:
            return {
                ...state,
                pagesPending: false,
                pagesSuccessfull: false,
                pagesError: action.data,
            }

        case CMS_PAGE.INDEX.REQUEST:
            return {
                ...state,
                pagesPending: true,
                pagesSuccessfull: false,
                pagesError: null
            }

        case CMS_PAGE.GET.SUCCESS:
            return produce(state, draftState => {
                const pageFromServer = action.data[0];
                if (!pageFromServer) return draftState;
                const pages = [...state.pages];
                if (pages.length === 0) {
                    draftState.pages = [pageFromServer]
                } else {
                    draftState.pages = pages.map(page => {
                        if (page.id === pageFromServer.id) return pageFromServer;
                        return page;
                    })
                }
                return draftState;
            })

        case CMS_PAGE.GET.FAILURE:
            return {
                ...state
            }

        case CMS_PAGE.GET.REQUEST:
            return {
                ...state
            }

        case CMS_LEGAL.INDEX.SUCCESS:
            return {
                ...state,
                legal: {
                    ...state.legal,
                    menu: action.data.map(entry => ({ id: parseInt(entry.object_id), title: entry.title })),
                    pending: false,
                    successful: true,
                    error: null
                }
            }
        case CMS_LEGAL.INDEX.FAILURE:
            return {
                ...state,
                legal: {
                    ...state.legal,
                    pending: false,
                    successful: false
                }
            }
        case CMS_LEGAL.INDEX.REQUEST:
            return {
                ...state,
                legal: {
                    ...state.legal,
                    pending: true
                }
            }

        case CMS_LEGAL.GET.SUCCESS:
            return {
                ...state,
                legal: {
                    ...state.legal,
                    pages: {
                        index: [...state.legal.pages.index, action.data],
                        pending: false,
                        successful: true,
                        error: null
                    }
                }
            }
        case CMS_LEGAL.GET.FAILURE:
            return {
                ...state,
                legal: {
                    ...state.legal,
                    pages: {
                        ...state.legal.pages,
                        pending: false,
                        successful: false,
                        error: action.data
                    }
                }
            }
        case CMS_LEGAL.GET.REQUEST:
            return {
                ...state,
                legal: {
                    ...state.legal,
                    pages: {
                        ...state.legal.pages,
                        pending: true
                    }
                }
            }
        case CMS_SEARCH.GET.REQUEST:
            return {
                ...state,
                searchPending: true,
                searchSuccessfull: false,
                searchError: null
            }
        case CMS_SEARCH.GET.SUCCESS:
            console.log(action.data);
            return {
                ...state,
                searchPending: false,
                searchSuccessfull: true,
                searchError: null,
                searchResults: action.data
            }
        case CMS_SEARCH.GET.FAILURE:
            return {
                ...state,
                searchPending: true,
                searchSuccessfull: false,
                searchError: action.data
            }
        case CMS_SEARCH_CLEAR:
            return {
                ...state,
                searchPending: false,
                searchSuccessfull: false,
                searchError: null,
                searchResults: []
            }
        default:
            return state;
    }
};

export default cmsReducer;

// count: 1
// description: ""
// id: 1
// link: "https://cms.tacpic.de/category/allgemein/"
// meta: []
// name: "Allgemein"
// parent: 0
// slug: "allgemein"
// taxonomy: "category"
// _links: {self: Array(1), collection: Array(1), about: Array(1), wp:post_type: Array(1), curies: Array(1)}
// __proto__: Object
// 1:
// count: 0
// description: ""
// id: 4
// link: "https://cms.tacpic.de/category/wissen/tastgrafiken/techniken/analoge-techniken/"
// meta: []
// name: "analoge Techniken"
// parent: 3
// slug: "analoge-techniken"
// taxonomy: "category"
// _links: {self: Array(1), collection: Array(1), about: Array(1), up: Array(1), wp:post_type: Array(1), …}
// __proto__: Object