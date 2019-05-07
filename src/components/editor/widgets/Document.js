import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "../../gui/Button";
import {Radio} from "../../gui/Radio";
import Select from "../../gui/Select";
import {Row} from "../../gui/Grid";
import {Checkbox} from "../../gui/Checkbox";
import {Numberinput} from "../../gui/Input";
import {Upper} from "../../gui/WidgetContainer";

class Document extends Component {
    state = {
        verticalGridDisabled: false,
        horizontalGridDisabled: false
    };

    toggleVerticalGrid = (name, checked) => {
        this.setState({
            verticalGridDisabled: !checked
        })
    };

    toggleHorizontalGrid = (name, checked) => {
        this.setState({
            horizontalGridDisabled: !checked
        })
    };

    render() {
        return (
            <Upper>

                <Row>
                    <div className={"col-sm-6"}>

                        <Select options={
                            [

                            ]
                        }/>
                    </div>
                    <div className={"col-sm-6"}>
                        <Button icon={"star"}>Neue Vorgabe</Button>
                    </div>
                </Row>

                <fieldset>
                    <legend>Format</legend>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Select label={"editor:label_page-format"} options={
                                [
                                    {label: "A4", value: "a4"},
                                    {label: "A3", value: "a3"},
                                    {label: "Marburger Format (27 × 34 cm)", value: "marburg"}
                                ]}
                            />

                            <Select label={"editor:select_braille-system"} options={
                                [
                                    {label: "Braille DE Kurzschrift", value: "A"},
                                    {label: "Braille DE Langschrift", value: "A"},
                                    {label: "Braille DE Vollschrift", value: "A"},
                                    {label: "Computerbraille 8-Punkt DE Kurzschrift", value: "A"}
                                ]
                            }/>

                        </div>
                        <div className={"col-sm-6"}>
                            {/*<Radio name={"orientation"} options={[*/}
                                {/*{label: "editor:portrait", value: "portrait"},*/}
                                {/*{label: "editor:landscape", value: "landscape"}]}/>*/}
                            <Radio name={"orientation"} options={[
                                {label: "Hochformat", value: "portrait"},
                                {label: "Querformat", value: "landscape"}]}/>
                        </div>
                    </Row>
                </fieldset>

                <fieldset>
                    <legend>Grundraster</legend>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Checkbox
                                name={"cb_vertical-grid"}
                                default={!this.state.verticalGridDisabled}
                                onChange={this.toggleVerticalGrid}
                                label={"Vertikale Hilfslinien zeigen"} />

                        </div>

                        <div className={"col-sm-6"}>
                            <Numberinput
                                disabled={this.state.verticalGridDisabled}
                                label={"Abstand"}
                                sublabel={"vertikaler Hilfslinien"}
                                unit={"mm"} />
                        </div>
                    </Row>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Checkbox
                                name={"cb_horizontal-grid"}
                                default={!this.state.horizontalGridDisabled}
                                onChange={this.toggleHorizontalGrid}
                                label={"Horizontale Hilfslinien zeigen"} />
                        </div>
                        <div className={"col-sm-6"}>
                            <Numberinput
                                disabled={this.state.horizontalGridDisabled}
                                label={"Abstand"}
                                sublabel={"horizontaler Hilfslinien"}
                                unit={"mm"} />
                        </div>
                    </Row>
                </fieldset>

                <fieldset>
                    <legend>Startelemente</legend>
                    <Row>
                        <div className={"col-sm-6"}>
                            <Select label={"editor:label_page-binding"} options={
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
                                default={true}
                                onChange={this.toggleHorizontalGrid}
                                label={"Titel"} />
                            <Checkbox
                                name={"cb_orientation"}
                                default={true}
                                onChange={this.toggleHorizontalGrid}
                                label={"Markierung zur Orientierung"} />
                            <Checkbox
                                name={"cb_pagenr"}
                                default={true}
                                onChange={this.toggleHorizontalGrid}
                                label={"Seitenzahlen"} />
                        </div>
                    </Row>
                </fieldset>
            </Upper>
        );
    }
}

const mapStateToProps = state => {
    return {
        verticalGridSpacing: state.editor.verticalGridSpacing,
        horizontalGridSpacing: state.editor.horizontalGridSpacing
    }
};

const mapDispatchToProps = dispatch => {
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
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Document);