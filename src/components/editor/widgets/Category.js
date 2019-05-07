import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import Classifier from "../../gui/Classifier";
import cats from "../../../content/categories.json";
import {Button} from "../../gui/Button";
import styled from 'styled-components';
import Select from "../../gui/Select";
import Divider from "../../gui/Divider";
import {Row} from "../../gui/Grid";
import {Upper} from "../../gui/WidgetContainer"; //TODO aus Datenbank laden

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {assistant: false};
    }

    showAssistent = () => this.setState({assistant: true});
    hideAssistant = () => this.setState({assistant: false});

    render() {
        return (
            <Upper>
                {this.state.assistant ?
                    <Classifier categories={cats}/>
                :
                    <>
                        <Row modifier={"middle-sm"}>
                            <div className={"col-sm-4 col-sm-offset-1"}>
                            <p>
                                Dieser Grafikeditor bietet spezifische Hilfestellungen für bestimmte Arten von Grafiken. Hier können Sie die Art der Grafik festlegen und sich bei der Einordnung helfen lassen.
                            </p>
                            </div>
                        </Row>
                        <br />
                        <br />
                        <br />
                        <Row modifier={"middle-sm"} fullHeight>
                            <div style={{textAlign: "left"}} className={"col-sm-4 col-sm-offset-1"}>
                                <Select placeholder={"editor:placeholder_choose_category"}
                                        label={"editor:label_choose_category"} />
                            </div>
                            <div className={"col-sm-6"}>
                                <Button onClick={this.showAssistent} primary>Hilfe erhalten</Button>
                            </div>

                            {/*<Divider vertical label={"gui:or"} />*/}
                        </Row>
                    </>
                }


                {/*<Button onClick={this.openModal} primary>Hilfe erhalten</Button>*/}

                {/*{this.state.showModal &&*/}
                    {/*<Modal title={"editor:Category"} dismiss={this.closeModal} actions={[*/}
                        {/*{label: "Ok", template: "primary", align: "right", action: this.closeModal}, {label: "Abbrechen"}*/}
                    {/*]}>*/}
                        {/**/}
                    {/*</Modal>*/}
                {/*}*/}
            </Upper>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);