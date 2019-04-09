import React from 'react';

import {storiesOf} from '@storybook/react';
import {Tile} from "../components/gui/Tile";
import Classifier from "../components/gui/Classifier";

import cats from "../content/categories.json";

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

// s. Notizbuch
// Menü-Button: nur eine Aktion gewünscht, Aktion schließt das Overlay
// Nur Menüeinträge wie im OS Kontextmenü
// Flyout-Button: Ein bisher versteckter Teil der UI kommt zum Vorschein; mehrere Aktionen sollen eventuell darin ausgeführt werden, aber ein Zurückspringen zum darunterliegenden Content ist idR nicht gewünscht, Aktion schließt Overlay nicht

const structure = [];

storiesOf('Kategorisieren', module)
    .add('Überblick', () =>
        <section>
            <Classifier categories={cats} />
        </section>)
    .add('Kacheln', () =>
        <section>
            <div className={"row"}>
                <div className={"col-md-3 col-xs-12"}>
                    <Tile onClick={() => console.log("tile was clicked")} title={"Fotographische oder künstlerische Darstellung"} imgUrl={"images/sample_Balkendiagramm.svg"}/>
                </div>
                <div className={"col-md-3 col-xs-12"}>
                    <Tile title={"Balkendiagramm"} imgUrl={"images/sample_Schema.svg"}/>
                </div>
                <div className={"col-md-3 col-xs-12"}>
                    <Tile title={"Balkendiagramm"} imgUrl={["images/sample_Schema3D.svg", "images/sample_Schema.svg", "images/noise_colour.png"]}/>
                </div>
                <div className={"col-md-3 col-xs-12"}>
                    <Tile title={"Schematische Darstellung"} imgUrl={"images/sample_Karte.svg"}/>
                </div>
            </div>
        </section>
    );