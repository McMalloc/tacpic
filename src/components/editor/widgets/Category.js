import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import Classifier from "../../gui/Classifier";
import cats from "../../../content/categories.json";
import {Button} from "../../gui/Button";
import styled from 'styled-components';
import Select from "../../gui/Select";
import Divider from "../../gui/Divider";
import {Row} from "../../gui/Grid";
import {Upper} from "../../gui/WidgetContainer";
import {Alert} from "../../gui/Alert"; //TODO aus Datenbank laden

const groupedOptions = [
    {
        label: 'Illustrationen',
        options: [
            {label: "dreidimensionale", value: 4},
            {label: "flache", value: 3}
        ],
    },
    {
        label: 'Diagramme',
        options: [
            {label: "Balkendiagramm", value: 1},
            {label: "Liniendiagramm"}
        ],
    },
];

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {assistant: false};
    }

    handleCategoryChange = (newCat, path) => {
        //TODO mockup entfernen
        if (newCat === 1 || newCat === 3 || newCat === 4 || newCat === 5 || newCat === 6 || newCat === 7) {
            setTimeout(() => this.props.setCategory(newCat), 1000);
        }
    };

    showAssistent = () => this.setState({assistant: true});
    hideAssistant = () => this.setState({assistant: false});

    render() {
        return (
            <Upper>
                {this.state.assistant ?
                    <Classifier onChange={this.handleCategoryChange} categories={cats}/>
                :
                    <>
                        <Row>
                            <div className={"col-sm-6 col-sm-offset-3"}>
                            <Alert info>
                                Dieser Grafikeditor bietet spezifische Hilfestellungen für bestimmte Kategorien von Grafiken. Hier können Sie die Kategorie festlegen oder sich bei der Einordnung helfen lassen.
                            </Alert>
                            </div>
                        </Row>
                        <br />
                        <br />
                        <br />
                        <Row>
                            <div className={"col-sm-6 col-sm-offset-3"}>
                                <Select placeholder={"editor:placeholder_choose_category"}
                                        default={this.props.category}
                                        onChange={event => this.props.setCategory(event.value)}
                                        options={groupedOptions}
                                        label={"editor:label_choose_category"} />
                                <Divider label={"gui:or"} /><br />
                                <div style={{textAlign: "center"}}>
                                    <Button onClick={this.showAssistent} primary>Hilfe erhalten</Button>
                                </div>

                            </div>
                        </Row>
                    </>
                }
            </Upper>
        );
    }
}

const mapStateToProps = state => {
    return {
        category: state.editor.openedFile.category
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setCategory: catID => {
            dispatch({
                type: "CHANGE_CATEGORY",
                catID
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);