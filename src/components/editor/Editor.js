import React, {useEffect} from 'react';
import {Responsive, WidthProvider} from "react-grid-layout";
import {useDispatch, useSelector} from "react-redux";

import Widget from "../gui/WidgetContainer";
import Widgets from "./widgets";

import '../../styles/Editor.css';
import styled from 'styled-components';
import Ribbon from "../gui/Ribbon";
import {useTranslation} from "react-i18next";
import Tooltip from "../gui/Tooltip";
import {FILE} from "../../actions/constants";
import {useParams} from "react-router";

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

const layoutChanged = (dispatch, layout, config) => {
    // react-grid-layout verschluckt die visible property, daher muss sie manuell mitgegeben werden
    layout.forEach(widget => {
        let fromConfig = config.find(c => c.i === widget.i);
        widget.visible = fromConfig.visible;
        if (widget.i === "Canvas") { // TODO nachhaltiger fixen. wenn die sichtbarkeit geändert wird, gibt rgl w=1/h=1 im callback zurück
            widget.w = widget.w === 1 ? fromConfig.w : widget.w;
            widget.h = widget.h === 1 ? fromConfig.h : widget.h;
        }
    });

    dispatch({
        type: "LAYOUT_CHANGED",
        layout
    });
};

const layoutSet = (dispatch, layoutIndex) => {
    dispatch({
        type: "LAYOUT_SET",
        layoutIndex
    });
};

const Editor = props => {
    const uiSettings = useSelector(
        state => state.editor.ui
    );
    const dispatch = useDispatch();
    const t = useTranslation().t;
    let {graphic_id, variant_id} = useParams();
    useEffect(() => {
        // TODO Editor wird natürlich immer neu gezeichnet, daher abfangen
        // dispatch({
        //     type: FILE.OPEN.REQUEST,
        //     id: variant_id, mode: "edit"
        // })
    });

    if (uiSettings.initialized) {
        return (
            <Wrapper>
                <Tooltip />
                <Ribbon activeItem={uiSettings.currentLayout} menus={[
                    {label: "editor_ui:intro",  icon: "flag-checkered", action: () => {layoutSet(dispatch, 0)}},
                    {label: "editor_ui:original",  icon: "file-image", action: () => {layoutSet(dispatch, 1)}},
                    {label: "editor_ui:category",  icon: "tags",       action: () => {layoutSet(dispatch, 2)}},
                    {label: "editor_ui:layout",    icon: "sticky-note",    action: () => {layoutSet(dispatch, 3)}},
                    {label: "editor_ui:draw",      icon: "pen",        action: () => {layoutSet(dispatch, 4)}},
                    {label: "editor_ui:legend",    icon: "braille",    action: () => {layoutSet(dispatch, 5)}},
                    {label: "editor_ui:verbalise", icon: "book-open",  action: () => {layoutSet(dispatch, 6)}},
                    {label: "editor_ui:proofing",  icon: "glasses",    action: () => {layoutSet(dispatch, 7)}},
                    {label: "editor_ui:finish",    icon: "check-square",action: () => {layoutSet(dispatch, 8)}},
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
                        lg: uiSettings.widgetConfig,
                        sm: uiSettings.widgetConfig
                    }}
                    margin={[widgetPadding, widgetPadding]}
                    // onResizeStop={this.props.canvasResized}
                    onLayoutChange={layout => layoutChanged(dispatch, layout, uiSettings.widgetConfig)}
                    rowHeight={rowHeight}>

                    {uiSettings.widgetConfig
                        // TODO: layoutChanged event-Callback gibt das aktuelle Layout ohne visible property zurück (und werden demnach ohne diese im LS gespeichert);
                        // wenn diese fehlt werden natürlich sämtliche Widgets ausgefiltert
                        .filter(widget => { return widget.visible })
                        .map((widget, index) => {
                            return (
                                <div key={widget.i}>
                                    {/*<Tooltip />*/}
                                    <Widget
                                        title={t("editor_ui:" + widget.i)}
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
};

const mapDispatchToProps = dispatch => {
    return {

    }
};

export default Editor;