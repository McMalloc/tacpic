import React, {Component} from 'react';
import {useSelector} from "react-redux";
import ShapeContext from "./ShapeContext";
import LabelContext from "./LabelContext";
import {find} from 'lodash';
import {WidgetWrapper} from "../../../gui/WidgetContainer";
import Keyedit from "../Keyedit";

// to refactor to function component
const Context = () => {
    const type = useSelector(state => find(state.editor.file.present.pages[state.editor.ui.currentPage].objects, {uuid: state.editor.ui.selectedObjects[0]}) || {}).type
    switch (type) {
        case "path":
        case "ellipse":
        case "rect":
            return (
                <WidgetWrapper><ShapeContext/></WidgetWrapper>
            );
        case "label":
            return (
                <WidgetWrapper><LabelContext/></WidgetWrapper>
            );
        case "key":
            return (
                <WidgetWrapper><Keyedit/></WidgetWrapper>
            );
        default:
            return null;
    }
}

export default Context;