import React, {Component} from 'react';
import {useSelector} from "react-redux";
import ShapeContext from "./ShapeContext";
import LabelContext from "./LabelContext";
import {find} from 'lodash';
import {Upper} from "../../../gui/WidgetContainer";
import Keyedit from "../Keyedit";

// to refactor to function component
const Context = () => {
    const type = useSelector(state => find(state.editor.file.present.pages[state.editor.ui.currentPage].objects, {uuid: state.editor.ui.selectedObjects[0]}) || {}).type
    switch (type) {
        case "path":
        case "ellipse":
        case "rect":
            return (
                <Upper><ShapeContext/></Upper>
            );
        case "label":
            return (
                <Upper><LabelContext/></Upper>
            );
        case "key":
            return (
                <Upper><Keyedit/></Upper>
            );
        default:
            return null;
    }
}

export default Context;