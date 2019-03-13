// setting up redux and saga
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import throttle from 'lodash/throttle'

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
    widgetConfig: JSON.parse(localStorage.getItem('user_layout')) || [ //TODO default aus config laden
        {
            i: "Canvas",
            x: 0,
            y: 0,
            w: 8,
            h: 15,
            visible: true,
            static: false
        }, {
            i: "Toolbox",
            x: 0,
            y: 1,
            w: 2,
            h: 3,
            visible: true,
            static: false
        }, {
            i: "History",
            x: 0,
            y: 0,
            w: 2,
            h: 3,
            visible: true,
            static: false
        }, {
            i: "Navigator",
            x: 2,
            y: 0,
            w: 3,
            h: 3,
            visible: true,
            static: false
        },
        {
            i: "Objects",
            x: 2,
            y: 0,
            w: 3,
            h: 3,
            visible: true,
            static: false
        },
        {
            i: "Context",
            x: 5,
            y: 1,
            w: 3,
            h: 3,
            visible: true,
            static: false
        },
        {
            i: "Pages",
            x: 5,
            y: 0,
            w: 3,
            h: 3,
            visible: true,
            static: false
        }
    ]
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