import { configure, addDecorator } from '@storybook/react';
import {standard} from "../src/styles/themes";
import React from "react";
import { ThemeProvider } from 'styled-components'

import '../src/index.scss';
import './stories.scss';
// import {withInfo} from "@storybook/addon-info";
import { withA11y } from '@storybook/addon-a11y';


function loadStories() {
    require('../src/stories/einleitung.js');
    require('../src/stories/navigation.js');
    require('../src/stories/elemente.js');
    require('../src/stories/button.js');
    require('../src/stories/layout.js');
    require('../src/stories/modal.js');
    require('../src/stories/form.js');
    require('../src/stories/auswahl.js');
    require('../src/stories/menus.js');
    require('../src/stories/feedback.js');
    require('../src/stories/kategorisieren.js');

    // der andere shizzle
    require('../src/stories');
}

addDecorator(story => (
    <ThemeProvider theme={standard}>
        {story()}
    </ThemeProvider>
));

addDecorator(withA11y);
configure(loadStories, module);
