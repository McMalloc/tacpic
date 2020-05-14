// external imports
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {ThemeProvider} from 'styled-components';
import './i18n/i18n';

// DELETE
import deepFilter from './utility/deepPull';
import {filter} from 'lodash';

// app imports
import './index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {store} from "./store";
import {standard} from "./styles/themes"
import {BrowserRouter} from "react-router-dom";

if (process.env.NODE_ENV !== 'production') {
    // let axe = require('react-axe');
    // axe(React, ReactDOM, 1000);
}

// bootstrapping the app
ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={standard}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root'));

// for debugging purposes
registerServiceWorker();

// TODO Note:
// Using an arrow function in render creates a new function each time the component renders, which may break optimizations based on strict identity comparison.