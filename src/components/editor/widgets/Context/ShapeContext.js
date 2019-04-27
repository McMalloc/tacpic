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
    
    render() {
        const fill = <div>

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

            <fieldset>
                <legend>Relief</legend>
                {/*<Checkbox default={this.props.texture !== null} name={"relief"} label={"Füllung fühlbar reliefieren"}/>*/}

                <TexturePalette
                    disabled={this.props.nothingSelected}
                    textures={[null, "striped", "bigdots"]}
                    selected={this.props.selectedTexture}
                    onChange={this.changeTexture}/>

                <Checkbox name={"padding"}
                          label={"Abstand zwischen Textur und Rand"}/>
                <Numberinput unit={"mm"}/>
            </fieldset>

            <fieldset>
                <legend>Farbe</legend>
                {/*<Checkbox name={"colour"} label={"Farbe sichtbar drucken"}/>*/}
                <Checkbox name={"texture"} label={"Textur sichtbar drucken"}/>

                <Palette selected={this.props.selectedFill}
                         onChange={this.props.switchFillMode}
                         colours={
                            [null, '#000000', '#1f78b4', '#b2df8a', '#e31a1c', '#ff7f00', '#cab2d6', '#b15928']
                        } extendedColours={
                            ['#a6cee3', '#33a02c', '#fb9a99', '#fdbf6f', '#6a3d9a', '#ffff99']
                        }/>
            </fieldset>
        </div>;

        const border = <div>
            <button onClick={() => {
                this.props.switchFillMode("rgba(255,0,0,0.4)");
            }}>rot
            </button>
            <button onClick={() => {
                this.props.switchFillMode("rgba(0,255,0,0.4)");
            }}>grün
            </button>
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
    const selectedObject = find(state.editor.openedFile.pages[state.editor.currentPage].objects, {uuid: state.editor.selectedObjects[0]});
    if (isUndefined(selectedObject)) {
        return {
            nothingSelected: true
        }
    } else {
        return {
            selectedFill: selectedObject.fill,
            uuid: selectedObject.uuid,
            selectedMoniker: selectedObject.moniker,
            selectedTexture: selectedObject.pattern.template
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