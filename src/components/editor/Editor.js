import React, {Component} from 'react';
import {Responsive, WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";

import Widget from "./WidgetContainer";
import Widgets from "./widgets/Widgets"
import {canvasResized, layoutChanged, widgetVisibilityToggled} from "../../actions";

import './Editor.css';
import styled from 'styled-components';
import InteractiveSVG from "./widgets/ReactSVG/InteractiveSVG";

const Menu = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const rowHeight = 30;
const widgetPadding = 6;

class Editor extends Component {
    componentDidMount() {
        this.layouts = {
            lg: this.props.widgetConfig,
            sm: this.props.widgetConfig
        };
    };

    widgetResized(widgets, oldState, newState) {
        // this.canvasWidth = 300;
        // this.canvasHeight = 200;
    };

    render() {
        if (this.props.initialized) {
            return (
                <React.Fragment>
                    <Menu>
                        {this.props.widgetConfig.map((widgetDefinition, i) =>
                            <label key={i}>
                                <input
                                    name="isGoing"
                                    checked={widgetDefinition.visible}
                                    onChange={(event) => this.props.widgetVisibilityToggled(widgetDefinition.i, event.target.checked)}
                                    type="checkbox"/>
                                {widgetDefinition.i}
                            </label>
                        )}
                    </Menu>
                    <ResponsiveReactGridLayout
                        className="layout"
                        draggableHandle={'.drag-handle'}
                        cols={{lg: 12, sm: 8}}
                        id={'widget-grid'}
                        breakpoints={{lg: 1200, sm: 768}}
                        layouts={this.layouts}
                        margin={[widgetPadding, widgetPadding]}
                        onResizeStop={this.props.canvasResized}
                        onLayoutChange={this.props.layoutChanged}
                        rowHeight={rowHeight}>

                        {/*{this.widgets}*/}
                        {this.props.widgetConfig
                            .filter(widget => { return widget.visible })
                            .map(widget => {
                                return (
                                    <div key={widget.i}
                                         data-grid={{
                                             x: widget.x || 0,
                                             y: widget.y || 0,
                                             w: widget.w || 2,
                                             h: widget.h || 2,
                                             static: false
                                         }
                                         }>
                                        <Widget
                                            title={widget.i}
                                            component={Widgets[widget.i]}/>
                                    </div>
                                )
                            })}
                    </ResponsiveReactGridLayout>
                </React.Fragment>
            );
        } else {
            return (<div>Bitte warten.</div>)
        }
    }
}

const mapStateToProps = state => {
    return {...state.editor}
};

const mapDispatchToProps = dispatch => {
    return {
        widgetVisibilityToggled: (id, value) => {
            dispatch(widgetVisibilityToggled(id, value));
        },
        canvasResized: (widgets, oldState, newState) => {
            if (newState.i !== 'Canvas') return;
            dispatch(canvasResized(
                document.querySelector("#widget-container-Canvas .widget-content").offsetWidth - 6, //width of two borders
                document.querySelector("#widget-container-Canvas .widget-content").offsetHeight - 6) //(rowHeight + widgetPadding)-35)
            );

            // 8 ist die spaltenzahl für den schmalen breakpoint. @todo layout und breakpoints nicht mehr hardcoden
        },
        layoutChanged: (layout) => {
            dispatch(layoutChanged(layout));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);