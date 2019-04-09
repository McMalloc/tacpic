import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {createFillModeAction, createTextureModeAction} from "../../../../actions";
import {TabPane} from "../../../gui/Tabs";
import {Numberinput, Textinput} from "../../../gui/Input";
import {Checkbox} from "../../../gui/Checkbox";
import {Select} from "../../../gui/Select";
import {Button} from "../../../gui/Button";

class ShapeContext extends Component {
    render() {
        const fill = <div>
            <label>Vorgaben</label>
            <div className={"row"}>
                <div className={"col-md-6"}>

                    <Select options={
                        [
                            {label: "Aubergine", value: "A", children: []},
                            {
                                label: "Brot", value: "B", children: [
                                    {label: "Schwarzbrot", value: "Ba"},
                                    {
                                        label: "Weißbrot", value: "Bb", children: [
                                            {label: "Fluffig", value: "Bba"},
                                            {label: "Fest", value: "Bbb", children: []}
                                        ]
                                    }]
                            },
                            {label: "Ketchup", value: "C"}]
                    }/>
                </div>
                <div className={"col-md-6"}>
                    <Button>Neue Vorgabe</Button>
                </div>
            </div>
<hr />
            <div className={"row"}>
                <div className={"col-md-6"}>
                    <Checkbox name={"relief"} label={"Füllung fühlbar reliefieren"}/>

                    <Button onClick={() => {
                        this.props.switchTextureMode("striped");
                    }}>gestreift
                    </Button>
                    <Button onClick={() => {
                        this.props.switchTextureMode("dashed");
                    }}>gestrichelt
                    </Button>

                    <Checkbox name={"padding"} label={"Abstand zwischen Textur und Rand"}/>
                    <Numberinput unit={"mm"}/>
                </div>
                <div className={"col-md-6"}>
                    <Checkbox name={"colour"} label={"Farbe sichtbar drucken"}/>
                    <Checkbox name={"texture"} label={"Textur sichtbar drucken"}/>
                </div>
            </div>
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
            <Fragment>
                <div className={"row"}>
                    <div className={"col-md-6"}>
                        <Textinput label={"Bezeichner"}/>
                    </div>
                    <div className={"col-md-6"}>
                        <Checkbox name={"visible"} label={"Sichtbar"}/>
                        <Checkbox name={"locked"} label={"Sperren"}/>
                    </div>
                </div>
                <TabPane tabs={[
                    {
                        label: 'Füllung',
                        icon: 'paint-roller',
                        content: fill
                    },
                    {
                        label: 'Kontur',
                        icon: 'circle-notch',
                        content: border
                    }
                ]}/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {}
};

const mapDispatchToProps = dispatch => {
    return {
        switchTextureMode: (mode) => {
            dispatch(createTextureModeAction(mode));
        },
        switchFillMode: (fill) => {
            dispatch(createFillModeAction(fill));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShapeContext);