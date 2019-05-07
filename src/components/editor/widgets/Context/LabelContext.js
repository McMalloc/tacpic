import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {Row} from "../../../gui/Grid";
import Select from "../../../gui/Select";
import {Button} from "../../../gui/Button";
import TexturePalette from "../../../gui/TexturePalette";
import {Checkbox} from "../../../gui/Checkbox";
import {Multiline, Numberinput, Textinput} from "../../../gui/Input";
import { find } from "lodash";
import PositionSelect from "../../../gui/PositionSelect";

class LabelContext extends Component {
    onChangeHandler = event => {
        this.props.changeProp(this.props.selectedObject.uuid, "text", event.currentTarget.value);
    };
    
    toggleKey = event => {
        console.log(event.currentTarget.value);
        this.props.changeProp(this.props.selectedObject.uuid, "isKey", !this.props.selectedObject.isKey)
    };

    render() {
        return (
            <Fragment>
                <Row>
                    <div className={"col-md-6"}>
                        <Select label={"editor:presets"} options={
                            [
                                {label: "Aubergine", value: "A", children: []}
                            ]
                        }/>
                    </div>
                    <div className={"col-md-6"}>
                        <Button>Neue Vorgabe</Button>
                    </div>
                </Row>

                <hr />

                <fieldset>
                    <Multiline onChange={this.onChangeHandler} value={this.props.selectedObject.text} label={"Text"}/>
                </fieldset>

                <Row>
                    <div className={"col-md-6"}>
                        <Checkbox name={"is-key"}
                                  checked={this.props.selectedObject.isKey}
                                  onChange={this.toggleKey}
                                  label={"Schlüssel"}/>
                        <Textinput disabled={!this.props.selectedObject.isKey}
                                   onChange={event => this.props.changeProp(this.props.selectedObject.uuid, "keyVal", event.currentTarget.value)}
                                   value={this.props.selectedObject.keyVal}
                                   aria-labelledby={"is-key"}/>
                    </div>
                    <div className={"col-md-6"}>
                        <Checkbox name={"leading"}
                                  label={"Führungslinie"}/>
                    </div>
                </Row>

                <fieldset>
                    <legend>Punktschrift</legend>
                    {/*<Checkbox default={this.props.texture !== null} name={"relief"} label={"Füllung fühlbar reliefieren"}/>*/}
                    <Checkbox name={"full-character"}
                              checked={this.props.selectedObject.displayDots}
                              onChange={() => this.props.changeProp(this.props.selectedObject.uuid, "displayDots", !this.props.selectedObject.displayDots)}
                              label={"Beschriftung in Punktschrift"}/>

                    <Checkbox name={"full-character"}
                              label={"editor:cb_braille-full-character"}/>

                    <Checkbox name={"dot-grid"}
                              label={"editor:cb_braille-dot-grid"}/>

                    <Checkbox name={"show-border"}
                              label={"editor:cb_braille-show-border"}/>
                </fieldset>

                <fieldset>
                    <legend>Schwarzschrift</legend>
                    {/*<Checkbox default={this.props.texture !== null} name={"relief"} label={"Füllung fühlbar reliefieren"}/>*/}
                    <Checkbox name={"black-letter"}
                              checked={this.props.selectedObject.displayLetters}
                              onChange={() => this.props.changeProp(this.props.selectedObject.uuid, "displayLetters", !this.props.selectedObject.displayLetters)}
                              label={"Beschriftung in Schwarzschrift"}/>

                    <Select label={"editor:Schriftgröße"} options={
                        [
                            {label: "14 pt", value: 14},
                            {label: "18 pt", value: 18},
                            {label: "22 pt", value: 22},
                            {label: "30 pt", value: 30}
                        ]
                    }/>

                    {/*<PositionSelect*/}
                        {/*selected={this.props.selectedObject.position}*/}
                        {/*onChange={this.onChangeHandler}/>*/}
                </fieldset>

            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedObject: find(state.editor.openedFile.pages[state.editor.currentPage].objects, {uuid: state.editor.selectedObjects[0]}) || {}
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeProp: (uuid, prop, value) => {
            dispatch({
                type: 'OBJECT_PROP_CHANGED',
                uuid,
                prop,
                value
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelContext);