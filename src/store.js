// setting up redux and saga
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import throttle from 'lodash/throttle';
import layouts from "./components/editor/widgets/layouts.js";

const sagaMiddleware = createSagaMiddleware();

// const undoMiddleware = store => next => action => {
//     if (action.type === 'UNDO') {
//         debugger;
//         Canvas.redrawCanvas();
//     }
//     return next(action);
// };

const initialEditor = {
    mode: 'rect',
    texture: 'striped',
    width: 500,
    fill: '#ccc',
    height: 250,
    mouseOffset: {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0
    },
    currentPage: 0,
    selectedObjects: [],
    openedFile: {
        title: "Eine Datei",
        pages: [
            {
                name: "Seite 1",
                objects: []
            },
            {
                name: "Seite 2",
                objects: []
            }
        ]
    },
    initialized: true,
    widgetConfig: layouts.key
    // widgetConfig: JSON.parse(localStorage.getItem('user_layout')) || categorise
};

export const store = createStore(
    rootReducer,
    {
        editor: initialEditor
    },
    compose(
        applyMiddleware(sagaMiddleware),
        // applyMiddleware(undoMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

store.subscribe(throttle(() => {
    localStorage.setItem('user_layout', JSON.stringify(store.getState().editor.widgetConfig));
}, 1000)); // TODO: anpassen

sagaMiddleware.run(rootSaga);