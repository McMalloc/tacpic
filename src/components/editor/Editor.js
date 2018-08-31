import React, {Component} from 'react';
import {Responsive, WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";

import Widget from "./WidgetContainer";
import Widgets from "./widgets/Widgets"
import {canvasResized} from "../../actions";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Editor extends Component {
    componentDidMount() {
        let configuration = [
            {
                i: "Canvas",
                x: 0,
                y: 0,
                w: 8,
                h: 15
            }, {
                i: "Toolbox",
                x: 0,
                y: 0,
                w: 2,
                h: 3
            },
            {
                i: "Navigator",
                x: 0,
                y: 0,
                w: 3,
                h: 3
            },
            {
                i: "Context",
                x: 0,
                y: 0,
                w: 3,
                h: 3
            }
        ];

        let widgets = [];

        this.layouts = {
            lg: configuration,
            sm: configuration
        };

        let canvasWidth = 0;
        let canvasHeight = 0;
        this.widgets = [];

        configuration.forEach(element => {
            this.widgets.push(
                <div key={element.i}
                     data-grid={{
                         x: element.x || 0,
                         y: element.y || 0,
                         w: element.w || 2,
                         h: element.h || 2,
                         static: false
                     }
                     }>
                    <Widget
                        title={element.i}
                        component={Widgets[element.i]}/>
                </div>
            )
        });
    };

    widgetResized(widgets, oldState, newState) {
        // this.canvasWidth = 300;
        // this.canvasHeight = 200;
    };

    render() {
        if (this.props.initialized) {
            return (
                <ResponsiveReactGridLayout
                    className="layout"
                    draggableHandle={'.drag-handle'}
                    cols={{lg: 12, sm: 8}}
                    breakpoints={{lg: 1200, sm: 768}}
                    layouts={this.layouts}
                    onResizeStop={this.props.canvasResized}
                    rowHeight={30}>
                    {this.widgets}
                </ResponsiveReactGridLayout>
            );
        } else {
            return (<div>Bitte warten.</div>)
        }
    }
}

const mapStateToProps = state => {
    return {...state.editor.present}
};

const mapDispatchToProps = dispatch => {
    return {
        canvasResized: (widgets, oldState, newState) => {
            if (newState.i !== 'Canvas') return;
            // TODO richtige Größe ausrechnen
            dispatch(canvasResized(newState.w * 176, newState.h * 32));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);