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


const initialLayout = 8;
const fromLS = JSON.parse(localStorage.getItem("custom_layout_" + initialLayout));
const initialEditor = {
    mode: 'rect',
    clamping: false,
    texture: 'striped',
    width: 800,
    fill: "#1f78b4",
    height: 600,
    mouseOffset: {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0
    },
    currentPage: 0,
    verticalGridSpacing: 10, // todo: Dateieigenschaften sollten in 'openedFile'
    horizontalGridSpacing: 10,
    showVerticalGrid: false,
    showHorizontalGrid: false,
    selectedObjects: [],
    defaultTitle: true,
    openedFile: {
        title: "",
        tags: [],
        catalogueTitle: "",
        catalogueDescription: "",
        description: "",
        category: null,
        keyedTextures: {},
        pages: [
            {
                name: "Seite 1",
                objects: []
            }
        ]
    },
    initialized: true,
    currentLayout: initialLayout,
    widgetConfig: fromLS !== null ? fromLS : layouts[initialLayout]
    // widgetConfig: JSON.parse(localStorage.getItem('user_layout')) || categorise
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 }) || compose;

export const store = createStore(
    rootReducer,
    {
        editor: initialEditor
    },
    composeEnhancers(
        applyMiddleware(sagaMiddleware)
    )
);

// store.subscribe(throttle(() => {
//     localStorage.setItem('user_layout', JSON.stringify(store.getState().editor.widgetConfig));
// }, 1000));
// TODO: anpassen

sagaMiddleware.run(rootSaga);