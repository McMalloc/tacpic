import React, {Component} from 'react'
import {connect} from 'react-redux'
import {switchCursorMode} from '../../../actions/index'
import Toggle from "../../gui/Toggle";
import {createFillModeAction, createTextureModeAction} from "../../../actions";
import {Upper} from "../../gui/WidgetContainer";
import styled from "styled-components";

const iconMap = {
    SELECT: 'hand-pointer',
    RECT: 'vector-square',
    ELLIPSE: 'circle',
    CUBIC: 'bezier-curve',
    QUADRATIC: 'bezier-curve',
    LABEL: 'font'
};

const ToolboxToggle = styled.div`
  flex: 0 0 calc(50% - 4px);
  padding: 2px;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  //justify-content: space-between;
`;

class Toolbox extends Component {
    render() {
        return (
            <Upper>
                <Toolbar>
                    {["SELECT", "RECT", "ELLIPSE", "CUBIC", /*"QUADRATIC",*/ "LABEL", "PATH", /*"LINE"*/].map((tool, index) => {
                        return (
                            <ToolboxToggle key={index}>
                            <Toggle
                                label={"editor:toggle_tools-" + tool}
                                // disabled={mode !== "rect" && mode !== "label"}
                                fullWidth
                                icon={iconMap[tool]}
                                toggled={this.props.tool === tool}
                                onClick={() => {
                                    this.props.switchCursorMode(tool);
                                }}
                            /></ToolboxToggle>
                        )
                    })}

                </Toolbar>
            </Upper>
        )
    }

}

const mapStateToProps = state => {
    return {
        tool: state.editor.ui.tool,
        fill: state.editor.ui.fill,
        texture: state.editor.ui.texture
    }
};

const mapDispatchToProps = dispatch => {
    return {
        switchCursorMode: tool => {
            dispatch(switchCursorMode(tool));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox)