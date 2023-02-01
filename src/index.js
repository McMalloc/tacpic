// external imports
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import "./i18n/i18n";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./index.scss";
import App from "./App";
import env from "./env.json";
import { unregister } from "./registerServiceWorker";
import store, { history } from "./store/configureStore";
import { standard } from "./styles/themes";
import { BrowserRouter } from "react-router-dom";
import { BreakpointProvider } from "./contexts/breakpoints";
import { QUERIES } from "./config/constants";

const instance = createInstance({
  urlBase: `${window.location.protocol}//${window.location.host}`,
  trackerUrl: 'https://analytics.tacpic.de/matomo.php', // optional, default value: `${urlBase}matomo.php`
  srcUrl: 'https://analytics.tacpic.de/matomo.js', // optional, default value: `${urlBase}matomo.js`
  siteId: env.MATOMO_SITE_ID || 1,
})

window.matomoTracker = instance;


ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={standard}>
      <MatomoProvider value={instance}>
        <BrowserRouter history={history}>
          <DndProvider backend={HTML5Backend}>
            <BreakpointProvider queries={QUERIES}>
              <App />
            </BreakpointProvider>
          </DndProvider>
        </BrowserRouter>
      </MatomoProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// for debugging purposes
// registerServiceWorker();
unregister();
