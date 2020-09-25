// external imports
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {ThemeProvider} from 'styled-components';
import './i18n/i18n';
import {MatomoProvider, createInstance} from '@datapunt/matomo-tracker-react';
import { ConnectedRouter } from 'connected-react-router';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import './index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store, {history} from "./store/configureStore";
import {standard} from "./styles/themes"
import {BrowserRouter} from "react-router-dom";

// const instance = createInstance({
//     urlBase: 'https://tacpic.de',
//     trackerUrl: 'https://analytics.tacpic.de/matomo.php', // optional, default value: `${urlBase}matomo.php`
//     srcUrl: 'https://analytics.tacpic.de/matomo.js', // optional, default value: `${urlBase}matomo.js`
// })

// bootstrapping the app
    ReactDOM.render(
        <Provider store={store}>
            <ThemeProvider theme={standard}>
                {/*<MatomoProvider value={instance}>*/}
                    <BrowserRouter history={history}>
                        {/*<ConnectedRouter history={history}>*/}
                        <DndProvider backend={HTML5Backend}>
                            <App/>
                        </DndProvider>
                        {/*</ConnectedRouter>*/}
                    </BrowserRouter>
                {/*</MatomoProvider>*/}
            </ThemeProvider>
        </Provider>,
        document.getElementById('root'));

// for debugging purposes
registerServiceWorker();