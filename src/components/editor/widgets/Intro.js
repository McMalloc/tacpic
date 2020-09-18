import React from 'react';
import {WidgetWrapper} from "../../gui/WidgetContainer";
import {Button} from "../../gui/Button";
import {Icon} from "../../gui/_Icon";
import {layoutSet} from "../../../actions";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";

class Intro extends React.Component {
    state = {
        original: 0,
        digital: 0
    };

    render = () => {

        const Begin = () => {return(<>
            <Button onClick={() => this.props.layoutSet(2)}>Jetzt einordnen</Button>
            <p>
                Alternativ können sie auch direkt damit beginnen, <strong>das Dokument einzurichten</strong>.
            </p>
            <Button onClick={() => this.props.layoutSet(3)}>Jetzt einrichten</Button>
        </>)};
        return (
            <WidgetWrapper>

                <p>Auf der linken Seite können Sie die Arbeitsbereiche umschalten, die den üblichen Arbeitsschritten bei
                    der Erstellung taktiler Grafiken entsprechen. Jeder Bereich stellt nützliche Funktionen für die
                    bevorstehende Aufgabe bereit.</p>

                {this.state.original === 0 && this.state.digital === 0 &&
                    <p>Wenn Sie sich unsicher sind, nutzen Sie die folgende Frage als Einstieg:</p>
                }

                {this.state.original === 0 &&
                <>
                    <p><strong>Existiert die Grafik bereits, die Sie taktil umsetzen möchten?</strong></p>
                    <Button onClick={() => this.setState({original: 1})}>Ja, es gibt eine Vorlage</Button>&ensp;
                    <Button onClick={() => this.setState({original: 2})}>Nein, ich erarbeite Sie hier</Button>
                </>
                }

                {this.state.original === 1 && this.state.digital === 0  &&
                <>
                    <p><Icon icon={"arrow-right"} />&ensp;Ja, es gibt eine Vorlage.</p>
                    <p><strong>Liegt die Vorlage bereits als Datei auf dem Computer?</strong></p>
                    <Button onClick={() => this.props.layoutSet(1)}>Ja, Vorlage hochladen</Button>&ensp;
                    <Button onClick={() => this.setState({digital: 2})}>Nein</Button>
                </>
                }

                {this.state.original === 1 && this.state.digital === 2 &&
                    <>
                        <p><Icon icon={"arrow-right"} />&ensp;Ja, es gibt eine Vorlage.</p>
                        <p><Icon icon={"arrow-right"} />&ensp;Nein, die Vorlage liegt nicht auf meinem Computer.</p>
                        <p>
                            Lassen Sie sich helfen, die Grafik <strong>in eine Kategorie einzuordnen</strong>. Dieser Editor kann Ihnen dann passgenaue Hilfestellungen geben.
                        </p>
                        <Begin />
                    </>
                }


                {this.state.original === 2 &&
                <>
                    <Icon icon={"arrow-right"} />&ensp;Nein, ich erarbeite die Grafik hier.
                    <p>
                        Wenn sie bereits eine Vorstellung von der Grafik haben, können Sie die Grafik <strong>in eine Kategorie einordnen</strong>, damit Ihnen der Editor passende Hilfestellungen anbieten kann.
                    </p>
                    <Begin />
                </>
                }





                {/*<h2>Vorlagen</h2>*/}
                {/*<p>Liegt Ihnen die Vorlage bereits als digitale Datei vor?</p>*/}
                {/*<Button primary>Vorlage in den Editor laden</Button>*/}
                {/*<p>Benötigen Sie Hilfe beim Umsetzen einer Grafik?</p>*/}
                {/*<Button primary>Vorliegende Grafik einordnen</Button>*/}
                {/*<h2>Hilfestellungen</h2>*/}
                {/*<p>Nutzen Sie die Hilfe, wenn eine Funktion unklar ist.</p>*/}
            </WidgetWrapper>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        layoutSet: layoutIndex => {
            dispatch(layoutSet(layoutIndex));
        }
    }
};

export default connect(null, mapDispatchToProps)(withTranslation()(Intro));