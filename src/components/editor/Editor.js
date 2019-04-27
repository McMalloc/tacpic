import React, {Component} from 'react';
import {Responsive, WidthProvider} from "react-grid-layout";
import {connect} from "react-redux";

import Widget from "../gui/WidgetContainer";
import Widgets from "./widgets"
import {canvasResized, layoutChanged, layoutSet, widgetVisibilityToggled} from "../../actions";

import '../../styles/Editor.css';
import styled from 'styled-components';
import Ribbon from "../gui/Ribbon";
import {withTranslation} from "react-i18next";

const Wrapper = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  background-color: ${props => props.theme.accent_1};
`;

const Logo = styled.div`
  position: absolute;
  top: 0.7em;
  left: 0.7em;
  width: 100px;
  height: 50px;
  background-image: url("images/logo.svg");
  background-size: 100%;
  background-repeat: no-repeat;
`;

const ResponsiveReactGridLayout = styled(WidthProvider(Responsive))`
  flex: 1 1 100%;
`;
const rowHeight = 30;
const widgetPadding = 8;

class Editor extends Component {
    render() {
        if (this.props.initialized) {
            return (
                <Wrapper>
                    <Ribbon activeItem={this.props.currentLayout} menus={[
                        {label: "editor:original",  icon: "file-image", action: () => {this.props.layoutSet(0)}},
                        {label: "editor:category",  icon: "tags",       action: () => {this.props.layoutSet(1)}},
                        {label: "editor:layout",    icon: "columns",    action: () => {this.props.layoutSet(2)}},
                        {label: "editor:draw",      icon: "pen",        action: () => {this.props.layoutSet(3)}},
                        {label: "editor:legend",    icon: "braille",    action: () => {this.props.layoutSet(4)}},
                        {label: "editor:verbalise", icon: "book-open",  action: () => {this.props.layoutSet(5)}},
                        {label: "editor:proofing",  icon: "glasses",    action: () => {this.props.layoutSet(6)}},
                        {label: "editor:finish",    icon: "check-square",action: () => {this.props.layoutSet(7)}},
                    ]} />

                    <Logo />

                    <ResponsiveReactGridLayout
                        className="layout"
                        draggableHandle={'.drag-handle'}
                        cols={{lg: 12, sm: 12}}
                        id={'widget-grid'}
                        breakpoints={{lg: 1200, sm: 768}}
                        layouts={{
                            lg: this.props.widgetConfig,
                            sm: this.props.widgetConfig
                        }}
                        margin={[widgetPadding, widgetPadding]}
                        onResizeStop={this.props.canvasResized}
                        onLayoutChange={this.props.layoutChanged}
                        rowHeight={rowHeight}>

                        {this.props.widgetConfig
                            .filter(widget => { return widget.visible })
                            .map((widget, index) => {
                                return (
                                    <div key={widget.i}>
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
            // dispatch(canvasResized(
            //     document.querySelector("#widget-container-Canvas .widget-content").offsetWidth - 6, //width of two borders
            //     document.querySelector("#widget-container-Canvas .widget-content").offsetHeight - 6) //(rowHeight + widgetPadding)-35)
            // );

            // 8 ist die spaltenzahl für den schmalen breakpoint. @todo layout und breakpoints nicht mehr hardcoden
        },
        layoutChanged: (layout) => {
            dispatch(layoutChanged(layout));
        },
        layoutSet: (layoutIndex) => {
            dispatch(layoutSet(layoutIndex));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Editor));