import {storiesOf} from "@storybook/react";
import React from "react";
import {Textinput, Numberinput} from "../components/gui/Input";
import {Radio} from "../components/gui/Radio";
import {Checkbox} from "../components/gui/Checkbox";
import {Qid} from "../components/gui/Qid";

const exampleForm = `
Die Grafik 
# number id 
ist übertitelt mit 
# text title
.

Die horizontale Achse ist beschriftet mit 
# text horizontal

gemessen in 
# text unit | Keine Einheiten angegeben
und reicht von
# number min
bis
#number max
.


`;

storiesOf('Formular', module)
    .add('Input', () =>
        <section>
            <div className={"row"}>
                <div className={"col-xs-6"}>
                    <Textinput validator={/\w+/} label={"Vorname"}/>
                    <Textinput validator={/\w+/} label={"Nachname"}/>
                    <Numberinput unit={"mm"} label={"Länge"} sublabel={"des zu bearbeitenden Materials"}/>
                </div>
            </div>
        </section>
    )
    .add('Radio und Check', () =>
        <section>
            <div className={"row"}>
                <div className={"col-md-6"}>
                    <Radio default={"ice"} name={"nachtisch"} options={[
                        {label: "Eiscreme", value: "ice"},
                        {label: "Erdnusbutter", value: "peanut"},
                        {label: "Frisches Gemüse", value: "veg"}]}>
                    </Radio>
                </div>
                <div className={"col-md-6"}>
                    <Radio default={"ice"} name={"nachtisch2"} options={[
                        {label: "Eiscreme", value: "ice"},
                        {label: "Erdnusbutter", value: "peanut"},
                        {label: "Frisches Gemüse", value: "veg"}]}>
                    </Radio>
                </div>
            </div>

            <div className={"row"}>
                <div className={"col-md-6"}>
                    Main
                    <Checkbox name={"oko"} label={"Okonomiyaki"}/>
                    <Checkbox name={"bor"} label={"Borschtsch"}/>
                    <Checkbox name={"chi"} label={"Hühnerbeine"}/>
                </div>
                <div className={"col-md-6"}>
                    Extras
                    <Checkbox name={"choc"} label={"Salzige Schokobällchen"}/>
                    <Checkbox name={"yog"} label={"Lakritzjoghurt"}/>
                    <Checkbox name={"cheese"} label={"Reibekäse"}/>
                </div>
            </div>

            <p>
                Extras
                <Checkbox name={"choc2"} label={"Salzige Schokobällchen"}/>
                <Checkbox name={"yog2"} label={"Lakritzjoghurt"}/>
                <Checkbox name={"cheese2"} label={"Reibekäse"}/>
            </p>

            {/*<Checkbox label={"Geschüttelt"} />*/}
            {/*<Checkbox label={"On the rocks"} />*/}
        </section>
    )
    .add('Checkbox', () =>
        <section>

        </section>
    )
    .add('Datum', () =>
        <section>

        </section>
    )
    .add('Combobox', () =>
        <section>

        </section>
    )
    .add('Listbox', () =>
        <section>

        </section>
    )
    .add('Layout', () =>
        <section>
            styled-components-spacing und grid
        </section>
    )
    .add('Queried image description', () =>
        <section>
            <Qid template={exampleForm}>

            </Qid>
        </section>
    );