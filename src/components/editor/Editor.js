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
import Tooltip from "../gui/Tooltip";
import {find} from "lodash";

const Wrapper = styled.div`
  display: flex;
  position: relative;
  min-height: 100%;
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
                    <Tooltip />
                    <Ribbon activeItem={this.props.currentLayout} menus={[
                        {label: "editor:intro",  icon: "flag-checkered", action: () => {this.props.layoutSet(0)}},
                        {label: "editor:original",  icon: "file-image", action: () => {this.props.layoutSet(1)}},
                        {label: "editor:category",  icon: "tags",       action: () => {this.props.layoutSet(2)}},
                        {label: "editor:layout",    icon: "sticky-note",    action: () => {this.props.layoutSet(3)}},
                        {label: "editor:draw",      icon: "pen",        action: () => {this.props.layoutSet(4)}},
                        {label: "editor:legend",    icon: "braille",    action: () => {this.props.layoutSet(5)}},
                        {label: "editor:verbalise", icon: "book-open",  action: () => {this.props.layoutSet(6)}},
                        {label: "editor:proofing",  icon: "glasses",    action: () => {this.props.layoutSet(7)}},
                        {label: "editor:finish",    icon: "check-square",action: () => {this.props.layoutSet(8)}},
                    ]} />

                    <Logo />

                    <ResponsiveReactGridLayout
                        className="layout"
                        draggableHandle={'.drag-handle'}
                        cols={{lg: 12, sm: 12}}
                        id={'widget-grid'}
                        breakpoints={{lg: 1200, sm: 768}}
                        preventCollision={false}
                        layouts={{
                            lg: this.props.widgetConfig,
                            sm: this.props.widgetConfig
                        }}
                        margin={[widgetPadding, widgetPadding]}
                        // onResizeStop={this.props.canvasResized}
                        onLayoutChange={layout => this.props.layoutChanged(layout, this.props.widgetConfig)}
                        rowHeight={rowHeight}>

                        {this.props.widgetConfig
                        // TODO: layoutChanged event-Callback gibt das aktuelle Layout ohne visible property zurück (und werden demnach ohne diese im LS gespeichert);
                            // wenn diese fehlt werden natürlich sämtliche Widgets ausgefiltert
                            .filter(widget => { return widget.visible })
                            .map((widget, index) => {
                                return (
                                    <div key={widget.i}>
                                        {/*<Tooltip />*/}
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
        layoutChanged: (layout, config) => {
            // react-grid-layout verschluckt die visible property, daher muss sie manuell mitgegeben werden
            layout.forEach(widget => {
                let fromConfig = find(config, {i: widget.i});
                widget.visible = fromConfig.visible;
                if (widget.i === "Canvas") { // TODO nachhaltiger fixen. wenn die sichtbarkeit geändert wird, gibt rgl w=1/h=1 im callback zurück
                    widget.w = widget.w === 1 ? fromConfig.w : widget.w;
                    widget.h = widget.h === 1 ? fromConfig.h : widget.h;
                }
            });

            dispatch(layoutChanged(layout));
        },
        layoutSet: layoutIndex => {
            dispatch(layoutSet(layoutIndex));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Editor));