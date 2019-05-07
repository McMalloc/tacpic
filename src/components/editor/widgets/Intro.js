import React from 'react';
import styled from 'styled-components';
import {Upper} from "../../gui/WidgetContainer";
import {Button} from "../../gui/Button";
import {Alert} from "../../gui/Alert";

const Dropzone = styled.div`
  
`;

const Intro = props => {
    return (
        <Upper>
            <p>Auf der linken Seite können Sie die Arbeitsbereiche umschalten, die den üblichen Arbeitsschritten bei der Erstellung taktiler Grafiken entsprechen. Jeder Bereich stellt nützliche Funktionen für die bevorstehende Aufgabe bereit.</p>

            <p>Wenn Sie eine Grafik auf Grundlage einer vorhandenen Grafik, z.B. aus einem Lehrbuch, anfertigen möchten, können Sie die Vorlage als Referenz in das Dokument einfügen und die Art der Grafik bestimmen, um spezifische Hilfestellungen zu erhalten.</p>
            {/*<h2>Vorlagen</h2>*/}
            {/*<p>Liegt Ihnen die Vorlage bereits als digitale Datei vor?</p>*/}
            {/*<Button primary>Vorlage in den Editor laden</Button>*/}
            {/*<p>Benötigen Sie Hilfe beim Umsetzen einer Grafik?</p>*/}
            {/*<Button primary>Vorliegende Grafik einordnen</Button>*/}
            {/*<h2>Hilfestellungen</h2>*/}
            {/*<p>Nutzen Sie die Hilfe, wenn eine Funktion unklar ist.</p>*/}
        </Upper>
    );
};

export default Intro;