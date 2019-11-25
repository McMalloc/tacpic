import React, {Component} from 'react'
import {connect} from 'react-redux'
import {switchCursorMode} from '../../../actions/index'
import {Button} from "../../gui/Button";
import Toggle from "../../gui/Toggle";
import Toolbar from "../../gui/Toolbar";
import Palette from "../../gui/Palette";
import TexturePreview from "../../gui/TexturePreview";
import {createFillModeAction, createTextureModeAction} from "../../../actions";
import TexturePalette from "../../gui/TexturePalette";
import {Row} from "../../gui/Grid";
import {Upper} from "../../gui/WidgetContainer";
import ContextOptions from "./ReactSVG/ContextOptions";

class Toolbox extends Component {
    render() {
        return (
            <Upper>
                <Toolbar>
                    {["rect", "ellipse", "line", "curve", "label"].map((mode, index) => {
                        return (
                            <Toggle
                                label={"editor:toggle_tools-" + mode}
                                key={index}
                                disabled={mode !== "rect" && mode !== "label"}
                                fullWidth
                                toggled={this.props.mode === mode}
                                onClick={() => {
                                    this.props.switchCursorMode(mode);
                                }}
                            />
                        )
                    })}

                </Toolbar>
                {/*<Button*/}
                {/*label={"editor:button_tools-diagram"}*/}
                {/*icon={"chart-bar"}*/}
                {/*disabled*/}
                {/*onClick={() => {*/}
                {/*}}>editor:button_tools-diagram</Button>*/}

                {/*<hr />*/}

                {/*<Row>*/}
                    {/*<div className={"col-sm-6"}>*/}
                        {/*<legend>Farbe</legend>*/}
                    {/*<Palette selected={this.props.fill} onChange={this.props.switchFillMode} colours={*/}
                        {/*[null, '#000000', '#1f78b4', '#b2df8a', '#e31a1c', '#ff7f00', '#cab2d6', '#b15928']*/}
                    {/*} extendedColours={*/}
                        {/*['#a6cee3', '#33a02c', '#fb9a99', '#fdbf6f', '#6a3d9a', '#ffff99']*/}
                    {/*}/></div>*/}

                    {/*<div className={"col-sm-6"}>*/}
                        {/*<legend>Relief</legend>*/}
                    {/*<TexturePalette textures={[null, "striped", "bigdots", "dashed"]} selected={this.props.texture}*/}
                                    {/*onChange={this.props.switchTextureMode}/></div>*/}
                {/*</Row>*/}
            </Upper>
        )
    }

}

const mapStateToProps = state => {
    return {
        mode: state.editor.ui.mode,
        fill: state.editor.ui.fill,
        texture: state.editor.ui.texture
    }
};

const mapDispatchToProps = dispatch => {
    return {
        switchCursorMode: mode => {
            dispatch(switchCursorMode(mode));
        },
        switchTextureMode: mode => {
            dispatch(createTextureModeAction(mode));
        },
        switchFillMode: colour => {
            dispatch(createFillModeAction(colour));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox)