import React from 'react';

import {storiesOf} from '@storybook/react';

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

// s. Notizbuch
// Menü-Button: nur eine Aktion gewünscht, Aktion schließt das Overlay
// Nur Menüeinträge wie im OS Kontextmenü
// Flyout-Button: Ein bisher versteckter Teil der UI kommt zum Vorschein; mehrere Aktionen sollen eventuell darin ausgeführt werden, aber ein Zurückspringen zum darunterliegenden Content ist idR nicht gewünscht, Aktion schließt Overlay nicht

storiesOf('Menüs', module)
    .add('Kontextmenü', () =>
        <section>

        </section>)
    .add('Flyoutmenü', () =>
        <section>

        </section>
    );