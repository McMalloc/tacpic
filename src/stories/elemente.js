import {storiesOf} from "@storybook/react";
import React from "react";

import typographie_notes from "./elemente_typographie_notes.md";
import TexturePreview from "../components/gui/TexturePreview";

storiesOf('Elemente', module)
    .add('Typographie', () =>
        <section>
            <h1>Überschrift erster Ordnung</h1>
            <p><em>Sollte nur einmal pro Seite vorhanden sein.</em></p>
            <p>{faker.lorem.paragraphs(2)}</p>
            <p>{faker.lorem.paragraphs(2)}</p>
            <h2>Überschrift zweiter Ordnung</h2>
            <p>{faker.lorem.paragraphs(2)}</p>
            <h3>Überschrift dritter Ordnung</h3>
            <p>{faker.lorem.paragraphs(2)}</p>
            <h4>Überschrift vierter Ordnung</h4>
            <p>{faker.lorem.paragraphs(2)}</p>

            <h5>Überschrift fünfter Ordnung</h5>
            <p>So viele Hierarchieebenen brauchen wir hoffentlich nicht.</p>

            <h6>Überschrift sechster Ordnung</h6>
            <p>So viele Hierarchieebenen brauchen wir hoffentlich nicht.</p>
        </section>,
        {
            notes: {
                markdown: typographie_notes
            }
        }
    )
    .add('Farben, Icons und Kontexte', () =>
        <section>
        </section>
    )
    .add('Voransichten', () =>
        <section>
            <TexturePreview template={"striped"}/>&nbsp;
            <TexturePreview template={"bigdots"}/>
        </section>
    );
