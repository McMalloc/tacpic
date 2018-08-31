// external imports
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

// app imports
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {store} from "./store";

// bootstrapping the app
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// for debugging purposes
registerServiceWorker();