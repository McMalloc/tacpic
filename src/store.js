// setting up redux and saga
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import Canvas from "./components/editor/widgets/Canvas";

const sagaMiddleware = createSagaMiddleware();

// const undoMiddleware = store => next => action => {
//     if (action.type === 'UNDO') {
//         debugger;
//         Canvas.redrawCanvas();
//     }
//     return next(action);
// };

export const store = createStore(
    rootReducer,
    undefined,
    // {editor: {mode: 'circle', objects: []}},
    compose(
        applyMiddleware(sagaMiddleware),
        // applyMiddleware(undoMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

sagaMiddleware.run(rootSaga);