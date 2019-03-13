import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {createFillModeAction, createTextureModeAction} from "../../../../actions";
import {TabPane} from "../../../gui/Tabs";

class ShapeContext extends Component {
    render() {
        const fill = <div>
            <button onClick={() => { this.props.switchTextureMode("striped"); }}>gestreift</button>
            <button onClick={() => { this.props.switchTextureMode("dashed"); }}>gestrichelt</button>
        </div>;
        const border = <div>
            <button onClick={() => { this.props.switchFillMode("rgba(255,0,0,0.4)"); }}>rot</button>
            <button onClick={() => { this.props.switchFillMode("rgba(0,255,0,0.4)"); }}>grün</button>
        </div>;
        return (
            <Fragment>
                <TabPane tabs={[
                    {
                        label: 'Füllung',
                        icon: '▧',
                        content: fill
                    },
                    {
                        label: 'Kontur',
                        icon: '◠',
                        content: border
                    }
                ]} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
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