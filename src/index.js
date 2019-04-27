// external imports
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { ThemeProvider } from 'styled-components';
import './i18n/i18n';

// app imports
import './index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {store} from "./store";
import { standard } from "./styles/themes"

if (process.env.NODE_ENV !== 'production') {
    // let axe = require('react-axe');
    // axe(React, ReactDOM, 1000);
}

// bootstrapping the app
ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={standard}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('root'));

// for debugging purposes
registerServiceWorker();