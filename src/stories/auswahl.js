import {storiesOf} from "@storybook/react";
import React from "react";
import {Select} from "../components/gui/Select";
import {Treeview} from "../components/gui/Treeview";

storiesOf('Auswahl', module)
    .add('Listbox', () =>
        <section>

        </section>
    )
    .add('Treeview', () =>
        <section>
            <Treeview options={
                [
                    {label: "Aubergine", value: "A", children: []},
                    {label: "Brot", value: "B", children: [
                        {label: "Schwarzbrot", value: "Ba"},
                        {label: "Weißbrot", value: "Bb", children: [
                                {label: "Fluffig", value: "Bba"},
                                {label: "Fest", value: "Bbb", children: []}
                            ]
                        }]},
                    {label: "Ketchup", value: "C"}]
            } />
        </section>
    )
    .add('Select / Combobox', () =>
        <section>
            <Select options={[
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' }]
            } />
        </section>
    );