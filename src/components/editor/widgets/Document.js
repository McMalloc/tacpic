import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "../../gui/Button";
import {Radio} from "../../gui/Radio";
import Select from "../../gui/Select";
import {Row} from "../../gui/Grid";
import {Checkbox} from "../../gui/Checkbox";
import {Numberinput, Textinput} from "../../gui/Input";
import {Upper} from "../../gui/WidgetContainer";
import Tooltip from "../../gui/Tooltip";
import {Alert} from "../../gui/Alert";

class Document extends Component {
    render() {
        return (
            <Upper>
                <Tooltip/>
                <Row>
                    <div className={"col-sm-8"}>
                        <Textinput
                            onChange={event => {
                                this.props.changeTitle(event.currentTarget.value)
                            }}
                            value={this.props.title}
                            label={"Titel"}/>
                    </div>
                    <div className={"col-sm-4"}>
                        <Select label={"Vorlagen"} creatable options={
                            []
                        }/>
                    </div>
                </Row>

                <fieldset>
                    <legend>Format</legend>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Select label={"editor:label_page-format"} default={"a4"} options={
                                [
                                    {label: "A4", value: "a4"},
                                    {label: "A3", value: "a3"},
                                    {label: "Marburger Format (27 × 34 cm)", value: "marburg"}
                                ]}
                            />

                            <Select tip={"help:select_braille-system"} default={"de_k"}
                                    label={"editor:select_braille-system"} options={
                                [
                                    {label: "Braille DE Kurzschrift", value: "de_k"},
                                    {label: "Braille DE Langschrift", value: "de_l"},
                                    {label: "Braille DE Vollschrift", value: "de_v"},
                                    {label: "Computerbraille 8-Punkt DE Kurzschrift", value: "cb"}
                                ]
                            }/>


                        </div>
                        <div className={"col-sm-6"}>
                            {/*<Radio name={"orientation"} options={[*/}
                            {/*{label: "editor:portrait", value: "portrait"},*/}
                            {/*{label: "editor:landscape", value: "landscape"}]}/>*/}
                            <Radio name={"orientation"} default={"landscape"} options={[
                                {label: "Hochformat", value: "portrait"},
                                {label: "Querformat", value: "landscape"}]}/>
                        </div>
                    </Row>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Select tip={"help:select_medium"} label={"editor:select_medium"} options={
                                [
                                    {label: "Schwellpapier", value: "swell"},
                                    {label: "3D-Druck", value: "3d", isDisabled: true},
                                    {label: "Thermoform", value: "thermo", isDisabled: true},
                                    {label: "Schnittcollage", value: "cut", isDisabled: true}
                                ]
                            } default={"swell"}/>
                        </div>
                        <div className={"col-sm-6"}>
                            {/*todo: erst zeigen, nachdem etwas anderes als Schwellpapier ausgewählt worden ist*/}
                            {/*<Alert info>*/}
                            {/*    Die Wahl des Mediums hat einen Einfluss auf die angebotenen Bearbeitungsfunktionen des*/}
                            {/*    Editors. <a href={"#"}>Mehr erfahren</a>*/}
                            {/*</Alert>*/}
                        </div>
                    </Row>
                </fieldset>

                <fieldset>
                    <legend>Grundraster</legend>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Checkbox
                                name={"cb_vertical-grid"}
                                checked={this.props.showVerticalGrid}
                                onChange={event => {
                                    this.props.toggleVerticalGrid(!this.props.showVerticalGrid)
                                }}
                                label={"Vertikales Gitternetz zeigen"}/>

                                <img style={{width: 80, height: "auto"}} src={"images/vertical_grid.svg"}/>
                        </div>

                        <div className={"col-sm-6"}>
                            <Numberinput
                                disabled={!this.props.showVerticalGrid}
                                onChange={event => {
                                    this.props.setVerticalGrid(event.currentTarget.value)
                                }}
                                value={this.props.verticalGridSpacing}
                                label={"Abstand"}
                                sublabel={"vertikaler Gitternetzlinien"}
                                unit={"mm"}/>
                        </div>
                    </Row>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Checkbox
                                name={"cb_horizontal-grid"}
                                checked={this.props.showHorizontalGrid}
                                onChange={event => {
                                    this.props.toggleHorizontalGrid(!this.props.showHorizontalGrid)
                                }}
                                label={"Horizontales Gitternetz zeigen"}/>

                            <img style={{width: 80, height: "auto"}} src={"images/horizontal_grid.svg"}/>
                        </div>

                        <div className={"col-sm-6"}>
                            <Numberinput
                                disabled={!this.props.showHorizontalGrid}
                                onChange={event => {
                                    this.props.setHorizontalGrid(event.currentTarget.value)
                                }}
                                value={this.props.horizontalGridSpacing}
                                label={"Abstand"}
                                sublabel={"horizontaler Gitternetzlinien"}
                                unit={"mm"}/>
                        </div>
                    </Row>
                </fieldset>

                <fieldset>
                    <legend>Startelemente</legend>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Select label={"editor:label_page-binding"} default={"none"} options={
                                [
                                    {label: "Keine Bindung", value: "none"},
                                    {label: "Ringbindung oben", value: "ro"},
                                    {label: "Ringbindung unten", value: "ru"}
                                ]}
                            />
                        </div>
                        <div className={"col-sm-6"}>
                            <Checkbox
                                name={"cb_title"}
                                checked={this.props.defaultTitle}
                                onChange={() => {
                                    this.props.toggleDefaultTitle(!this.props.defaultTitle)
                                }}
                                label={"Titel"}/>
                            <Checkbox
                                name={"cb_orientation"}
                                default={true}
                                onChange={this.toggleHorizontalGrid}
                                label={"Markierung zur Orientierung"}/>
                            <Checkbox
                                name={"cb_pagenr"}
                                default={true}
                                onChange={this.toggleHorizontalGrid}
                                label={"Seitenzahlen"}/>
                        </div>
                    </Row>
                </fieldset>
            </Upper>
        );
    }
}

const mapStateToProps = state => {
    return {
        verticalGridSpacing: state.editor.ui.verticalGridSpacing,
        horizontalGridSpacing: state.editor.ui.horizontalGridSpacing,
        showVerticalGrid: state.editor.ui.showVerticalGrid,
        showHorizontalGrid: state.editor.ui.showHorizontalGrid,
        title: state.editor.file.title,
        defaultTitle: state.editor.ui.defaultTitle
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setVerticalGrid: spacing => {
            dispatch({
                type: "VERTICAL_SPACING_SET",
                spacing
            })
        },
        setHorizontalGrid: spacing => {
            dispatch({
                type: "HORIZONTAL_SPACING_SET",
                spacing
            })
        },
        toggleVerticalGrid: state => {
            dispatch({
                type: "VERTICAL_SPACING_TOGGLE",
                payload: state
            })
        },
        toggleHorizontalGrid: state => {
            dispatch({
                type: "HORIZONTAL_SPACING_TOGGLE",
                state
            })
        },
        toggleDefaultTitle: state => {
            dispatch({
                type: "DEFAULT_TITLE_TOGGLE",
                state
            })
        },
        changeTitle: title => {
            dispatch({
                type: "CHANGE_TITLE",
                title
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Document);