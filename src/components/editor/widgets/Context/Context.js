import React, {Component} from 'react';
import {connect} from "react-redux";
import ShapeContext from "./ShapeContext";
import LabelContext from "./LabelContext";
import {find} from 'lodash';
import {Upper} from "../../../gui/WidgetContainer";

class Context extends Component {
    render() {
        switch (this.props.selectedObject.type) {
            case "rect":
                return (
                    <Upper><ShapeContext /></Upper>
                );
            case "label":
                return (
                    <Upper><LabelContext /></Upper>
                );
            default:
                return (
                    <Upper>
                        <p className={"disabled"}>
                            Kein Objekt gewählt.

                            Wählen Sie ein Objekt auf der Leinwand aus, um hier seine Eigeschaften zu ändern.
                        </p>
                    </Upper>
                );
        }
    }
}

// TODO: allen Kontexten das selektierte Objekt zur Verfügung stellen
// TODO: allen Kontexten changeProp() zur Verfügung stellen
const mapStateToProps = state => {
    return {
        selectedObject: find(state.editor.openedFile.pages[state.editor.currentPage].objects, {uuid: state.editor.selectedObjects[0]}) || {}
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Context);