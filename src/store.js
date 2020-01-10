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
const initialEditor = {
    ui: {
        // mode: 'path',
        tool: 'RECT',
        texture: 'striped',
        width: 400,
        fill: "#1f78b4",
        height: 400,
        mouseCoords: {
            originX: 0,
            originY: 0,
            offsetX: 0,
            offsetY: 0
        },
        currentPage: 0,
        scalingFactor: 1,
        viewPortX: 0,
        viewPortY: 0,
        selectedObjects: [],
        defaultTitle: true,
        initialized: true,
        currentLayout: initialLayout,
        widgetConfig: fromLS !== null ? fromLS : layouts[initialLayout]
    },
    file: {
        title: "",
        tags: [],
        backgroundURL: "",
        catalogueTitle: "",
        catalogueDescription: "",
        description: "",
        category: null,
        keyedTextures: {},
        medium: 'swell',
        system: 'de-de-g2', // name of the liblouis translation table
        width: 210,
        height: 290,
        verticalGridSpacing: 10, // TODO: Dateieigenschaften sollten in 'openedFile'
        horizontalGridSpacing: 10,
        showVerticalGrid: false,
        showHorizontalGrid: false,
        pages: [
            {
                name: "Seite 1",
                text: false, // TODO Textseiten werden anders behandelt, starres Braille-Layout
                objects: []
            }
        ]
    },
};

const initialCatalogue = {
    filterTags: [],
    filterTerms: [],
    limit: 0,
    offset: 0,
    graphics: []
};

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 5 })
    || compose;

// performance hack: the current editor page is shared with all file reducers
// to easily filter all objects in a document without structuring reducers
// unintuitively, e.g. the currently visible page, a detail of ui state, is
// of no concern for the objects of a document
const shareCurrentPage = store => next => action => {
    action.shared_currentPage = store.getState().editor.ui.currentPage;
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