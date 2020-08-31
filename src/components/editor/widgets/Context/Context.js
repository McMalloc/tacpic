import React, {Component} from 'react';
import {connect} from "react-redux";
import ShapeContext from "./ShapeContext";
import LabelContext from "./LabelContext";
import {find} from 'lodash';
import {Upper} from "../../../gui/WidgetContainer";
import Keyedit from "../Keyedit";

// to refactor to function component
class Context extends Component {
    render() {
        switch (this.props.selectedObject.type) {
            case "path":
            case "ellipse":
            case "rect":
                return (
                    <Upper><ShapeContext /></Upper>
                );
            case "label":
                return (
                    <Upper><LabelContext /></Upper>
                );
            case "key":
                return (
                    <Upper><Keyedit /></Upper>
                );
            default:
                return null;
        }
    }
}

// TODO: allen Kontexten das selektierte Objekt zur Verfügung stellen
// TODO: allen Kontexten changeProp() zur Verfügung stellen
const mapStateToProps = state => {
    return {
        selectedObject: find(state.editor.file.pages[state.editor.ui.currentPage].objects, {uuid: state.editor.ui.selectedObjects[0]}) || {}
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Context);