// external imports
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore,applyMiddleware, compose } from 'redux';
import { Provider } from "react-redux";
import createSagaMiddleware from 'redux-saga';

// app imports
import './index.css';
import App from './App';
import rootReducer from './reducers';
import rootSaga from './sagas';
import registerServiceWorker from './registerServiceWorker';

// setting up redux and saga
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    undefined,
    // {editor: {mode: 'circle', objects: []}},
    compose(
        applyMiddleware(sagaMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

sagaMiddleware.run(rootSaga);

// bootstrapping the app
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// for debugging purposes
registerServiceWorker();