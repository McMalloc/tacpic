// setting up redux and saga
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import layouts from "./components/editor/widgets/layouts.js";

const sagaMiddleware = createSagaMiddleware();

// const undoMiddleware = store => next => action => {
//     if (action.type === 'UNDO') {
//         debugger;
//         Canvas.redrawCanvas();
//     }
//     return next(action);
// };

const initialLayout = 4;
const fromLS = JSON.parse(localStorage.getItem("custom_layout_" + initialLayout));
export const initialEditor = {
    ui: {
        tool: 'RECT',
        texture: 'diagonal_lines',
        fill: "#1f78b4",
        mouseCoords: {
            originX: 0,
            originY: 0,
            offsetX: 0,
            offsetY: 0
        },
        currentPage: 0,
        scalingFactor: 1,
        viewPortX: 50,
        viewPortY: 50,
        previewMode: false,
        selectedObjects: [],
        defaultTitle: true,
        initialized: true,

        fileState: null,

        currentLayout: initialLayout,
        widgetConfig: fromLS !== null ? fromLS : layouts[initialLayout]
    },
    file: {
        title: "",
        graphicTitle: "",
        graphicDescription: "",
        variantTitle: "",
        variantDescription: "",
        transcribersNotes: "",
        tags: [],
        category: null,
        variant_id: null,
        graphic_id: null,
        version_id: null,
        lastVersionHash: null,

        backgroundURL: "",
        keyedStrokes: [],
        keyedTextures: [],
        medium: 'swell',
        system: 'de-de-g2.ctb', // name of the liblouis translation table
        width: 210,
        height: 297,
        verticalGridSpacing: 10, // TODO: Dateieigenschaften sollten in 'openedFile'
        horizontalGridSpacing: 10,
        showVerticalGrid: false,
        showHorizontalGrid: false,

        braillePages: {
            width: 210,
            height: 297,
            marginLeft: 1,
            marginTop: 1,
            cellsPerRow: 33,
            rowsPerPage: 27,
            pageNumbers: 0
        },
        pages: [
            {
                name: "Seite 1",
                text: false,
                rendering: '',
                objects: []
            },
            {
                name: "Seite 2",
                text: true, // TODO Textseiten werden anders behandelt, starres Braille-Layout
                content: '',
                braille: '',
                formatted: [[]]
            }
        ]
    },
};

const initialCatalogue = {
    filterTags: [],
    filterTerms: [],
    filterFormat: [],
    filterSystem: [],
    tags: [],
    limit: 50,
    offset: 0,
    graphics: [],
    viewedGraphic: {},
    graphicGetPending: true,
    searchPending: false,
    loadMorePending: false,
    quotedVariants: [],
    order: {
        pending: false,
        key: null,
        successful: false,
        error: null
    },
    quote: {
        items: [],
        pending: false,
        successfull: false,
        error: null
    }, // quote is the basket with added prices and packaging and postage items
    basket: JSON.parse(localStorage.getItem("basket")) || []
};

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true, traceLimit: 5})
    || compose;

// performance hack: the current editor page is shared with all file reducers
// to easily filter all objects in a document without structuring reducers
// unintuitively, e.g. the currently visible page, a detail of ui state, is
// of no concern for the objects of a document
const shareCurrentPage = store => next => action => {
    if (action.type.includes('OBJECT')) {
        action.shared_currentPage = store.getState().editor.ui.currentPage;
    }
    return next(action);
};

export const store = createStore(
    rootReducer,
    {
        editor: initialEditor,
        catalogue: initialCatalogue
    },
    composeEnhancers(
        applyMiddleware(sagaMiddleware, shareCurrentPage)
    )
);

sagaMiddleware.run(rootSaga);