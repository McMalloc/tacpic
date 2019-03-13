import {storiesOf} from "@storybook/react";
import {Button, FlyoutButton} from "../components/gui/Button";
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import React from "react";

storiesOf('Button', module)
    .addDecorator(withKnobs)
    .add('Kontext', () =>
        <section>
            <Button>{text('Label Standard', 'Standard Button')}</Button>
            <hr/>
            <Button>Ein sehr langer Button, der einfach kein Ende nimmt!</Button>
            <hr/>
            <Button primary>Primärer Button</Button>
        </section>
    )
    .add('Flyout', () =>
        <section>
            <FlyoutButton label={"Flyout"}>
                <label><input type="checkbox" />Check mich</label>
            </FlyoutButton>
            <hr />
            <FlyoutButton label={"Zweiter Flyout"}>
                <label><input type="checkbox" />Check mich</label>
            </FlyoutButton>
        </section>
    )
    .add('Mit Icon', () =>
        <section>
            <Button icon={'cog'} /> &emsp; <Button icon={'skull'} primary />
            <hr/>
            <Button icon={'cog'}>Mit Label</Button> <br /><br />
            <Button icon={'skull fa-spin'} primary>Wichtig mit Label</Button>
        </section>
    )
    .add('Gruppen', () =>
        <section>
            <Button icon={'cog'} />&nbsp;
            <Button>Funktion</Button>
            <Button icon={'skull'} />
            <FlyoutButton icon={'skull'} />
        </section>
    );