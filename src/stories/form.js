import {storiesOf} from "@storybook/react";
import {Button} from "../components/gui/Button";
import {action} from "@storybook/addon-actions";
import React from "react";

storiesOf('Formular', module)
    .add('Radiobutton', () =>
        <section>
            <Button onClick={action('clicked')}>Hello Button</Button>
        </section>
    )
    .add('Checkbox', () =>
        <section>

        </section>
    )
    .add('Input', () =>
        <section>

        </section>
    )
    .add('Layout', () =>
        <section>

        </section>
    );