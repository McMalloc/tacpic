import React, {Component} from 'react';
import {connect} from "react-redux";
import {createFillModeAction, createTextureModeAction} from "../../../../actions";
import TabPane from "../../../gui/Tabs";
import {Numberinput, Textinput} from "../../../gui/Input";
import {Checkbox} from "../../../gui/Checkbox";
import Select from "../../../gui/Select";
import {Button} from "../../../gui/Button";
import {Row} from "../../../gui/Grid";
import Palette from "../../../gui/Palette";
import {find, isUndefined, debounce} from 'lodash';
import TexturePalette from "../../../gui/TexturePalette";
import Tooltip from "../../../gui/Tooltip";

class ShapeContext extends Component {
    changeMoniker = event => {
        this.props.changeProp(this.props.uuid, "moniker", event.currentTarget.value);
    };

    changeTexture = texture => {
        this.props.changeProp(this.props.uuid, "pattern", {
            template: texture,
            angle: 0,
            scaleX: 1,
            scaleY: 1
        });
    };

    changeFill = fill => {
        this.props.changeProp(this.props.uuid, "fill", fill);
    };

    render() {
        const fill = <div>
            <Tooltip/>
            <Row>
                <div className={"col-md-12"}>
                    <Select label={"Vorlagen"} tip={"Tippen Sie hier, um eine neue Vorlage zu erstellen."} createable
                            placeholder={"Keine gewählt"} options={
                        [
                            {label: "Aubergine", value: "A", children: []}
                        ]
                    }/>
                </div>
            </Row>

            <fieldset>
                <legend>Relief</legend>
                {/*<Checkbox default={this.props.texture !== null} name={"relief"} label={"Füllung fühlbar reliefieren"}/>*/}

                <TexturePalette
                    disabled={this.props.nothingSelected}
                    textures={[null, "striped", "bigdots", "dashed"]}
                    selected={this.props.selectedTexture}
                    onChange={this.changeTexture}/>

                <Checkbox name={"padding"}
                          checked={this.props.object.pattern.offset}
                          onChange={() => {
                              this.props.changeProp(
                                  this.props.object.uuid,
                                  'pattern',
                                  {...this.props.object.pattern, offset: !this.props.object.pattern.offset})
                          }}
                          label={"Abstand zwischen Textur und Rand"}/>
                {this.props.offset + "--"}
                {/*<Numberinput unit={"mm"}/>*/}
            </fieldset>

            <fieldset>
                <legend>Farbe</legend>
                {/*<Checkbox name={"colour"} label={"Farbe sichtbar drucken"}/>*/}
                <Checkbox name={"texture"} label={"Textur sichtbar drucken"}/>

                <Palette selected={this.props.selectedFill}
                         onChange={this.changeFill}
                         colours={
                             [null, '#000000', '#1f78b4', '#b2df8a', '#e31a1c', '#ff7f00', '#cab2d6', '#b15928']
                         } extendedColours={
                    ['#a6cee3', '#33a02c', '#fb9a99', '#fdbf6f', '#6a3d9a', '#ffff99']
                }/>
            </fieldset>
        </div>;

        const _border = <div>
            <button onClick={() => {
                this.props.switchFillMode("rgba(255,0,0,0.4)");
            }}>rot
            </button>
            <button onClick={() => {
                this.props.switchFillMode("rgba(0,255,0,0.4)");
            }}>grün
            </button>
        </div>;

        const border = <div>
            to do
        </div>;

        return (
            <>
                <Row>
                    <div className={"col-md-6"}>
                        <Textinput value={this.props.selectedMoniker}
                                   disabled={this.props.nothingSelected}
                                   onChange={this.changeMoniker} label={"Bezeichner"}/>
                    </div>
                    <div className={"col-md-6"}>
                        <Checkbox disabled={isUndefined(this.props.selectedObject)} name={"visible"} label={"Aktiv"}/>
                        <Checkbox disabled={isUndefined(this.props.selectedObject)} name={"locked"} label={"Sperren"}/>
                    </div>
                </Row>
                <TabPane tabs={[
                    {
                        label: 'editor:tablist_shape-fill',
                        icon: 'paint-roller',
                        content: fill
                    },
                    {
                        label: 'editor:tablist_shape-contour',
                        icon: 'circle-notch',
                        content: border
                    }
                ]}/>
            </>
        );
    }
}

const mapStateToProps = state => {
    // TODO ersetzen durch Funktion
    const selectedObject = find(state.editor.file.pages[state.editor.ui.currentPage].objects, {uuid: state.editor.ui.selectedObjects[0]});
    if (isUndefined(selectedObject)) {
        return {
            nothingSelected: true
        }
    } else {
        return {
            selectedFill: selectedObject.fill,
            uuid: selectedObject.uuid,
            selectedMoniker: selectedObject.moniker,
            selectedTexture: selectedObject.pattern.template,
            object: selectedObject
        }
    }
};

const mapDispatchToProps = dispatch => {
    return {
        switchTextureMode: mode => {
            dispatch(createTextureModeAction(mode));
        },
        switchFillMode: colour => {
            console.log("switch swatch");
            dispatch(createFillModeAction(colour));
        },
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

export default connect(mapStateToProps, mapDispatchToProps)(ShapeContext);