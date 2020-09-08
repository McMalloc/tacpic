// setting up redux and saga
import createSagaMiddleware from "redux-saga";
import {applyMiddleware, compose, createStore} from "redux";
import {routerMiddleware} from 'connected-react-router'
import createRootReducer from "../reducers";
import rootSaga from "../sagas";
import {createBrowserHistory} from "history";
import {app, catalogue, editor, user} from "./initialState";

const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory()

// Devtools
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

export default createStore(
    createRootReducer(history), // root reducer with router state
    {editor, catalogue, user, app},
    composeEnhancers(
        applyMiddleware(
            // routerMiddleware(history), // for dispatching history actions
            sagaMiddleware,
            shareCurrentPage
        ),
    )
);

sagaMiddleware.run(rootSaga);

