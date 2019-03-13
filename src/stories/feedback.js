import {storiesOf} from "@storybook/react";
import React from "react";
import {Alert} from "../components/gui/Alert";

import notes from "./feedback_alerts_notes.md";

storiesOf('Feedback', module)
    .add('Notifications', () =>
            <section>

            </section>,
        {
            notes: {
                // markdown: typographie_notes
            }
        }
    )
    .add('Alerts', () =>
        <section>
            <Alert info>
                <p>Ein informativer Alert.</p> <p>{faker.lorem.paragraphs(1)}</p>
            </Alert> <br />
            <Alert warning>
                <strong>Ein warnender, einzeiliger Alert.</strong>
            </Alert> <br />
            <Alert danger>
                <p>Etwas Gefährliches geht vor sich.</p>  <p>{faker.lorem.paragraphs(1)} <a href={"#"}>Mehr erfahren</a> </p>
            </Alert> <br />
            <Alert success>
                <strong>Das hat gut geklappt.</strong> {faker.lorem.paragraphs(1)}
            </Alert>
        </section>,
        {notes}
    );