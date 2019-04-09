import React, {Component} from 'react';
import {Responsive, WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";

import Widget from "../gui/WidgetContainer";
import Widgets from "./widgets"
import {canvasResized, layoutChanged, layoutSet, widgetVisibilityToggled} from "../../actions";

import './Editor.css';
import styled from 'styled-components';
import {Ribbon} from "../gui/Ribbon";
import {withTranslation} from "react-i18next";
import {Tile} from "../gui/Tile";

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  //flex-direction: column;
`;

const ResponsiveReactGridLayout = styled(WidthProvider(Responsive))`
  flex: 1 1 100%;
`;
const rowHeight = 30;
const widgetPadding = 6;

class Editor extends Component {
    componentDidMount() {
        this.layouts = {
            lg: this.props.widgetConfig,
            sm: this.props.widgetConfig
        };
    };

    render() {
        if (this.props.initialized) {
            return (
                <Wrapper>
                    <Tile title={"hjdhs"} imgUrl={"fhdgsf"} />
                    <Ribbon menus={[
                        {label: "Zeichnen", icon: "pen", action: () => {this.props.layoutSet("categorise")}},
                        {label: "Überprüfen", icon: "search", action: () => {this.props.layoutSet("proofing")}},
                        {label: "Legende", icon: "search", action: () => {this.props.layoutSet("key")}}
                    ]}/>
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
                                            title={this.props.t("editor:" + widget.i)}
                                            component={Widgets[widget.i]}/>
                                    </div>
                                )
                            })}
                    </ResponsiveReactGridLayout>
                </Wrapper>
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
        // widgetVisibilityToggled: (id, value) => {
        //     dispatch(widgetVisibilityToggled(id, value));
        // },
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
        },
        layoutSet: (layoutName) => {
            dispatch(layoutSet(layoutName));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Editor));