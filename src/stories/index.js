import React from 'react';

import {storiesOf} from '@storybook/react';

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);


storiesOf('Baumansicht', module)
    .add('...', () =>
        <section>

        </section>
    );

storiesOf('Auswahl', module)
    .add('Multiselect', () =>
        <section>

        </section>
    )
    .add('Select / Combobox', () =>
        <section>

        </section>
    );

storiesOf('Tabs', module)
    .add('...', () =>
        <section>

        </section>
    );

storiesOf('Menüs', module)
    .add('Kontextmenü', () =>
        <section>

        </section>)
    .add('Flyoutmenü', () =>
        <section>

        </section>
    );

storiesOf('Kacheln', module)
    .add('Im Raster', () =>
        <section>

        </section>
    )
    .add('Titelbutton', () =>
        <section>

        </section>
    );