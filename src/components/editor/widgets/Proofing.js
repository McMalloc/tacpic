import React, {Component} from 'react';
import {connect} from "react-redux";
import {Treeview} from "../../gui/Treeview";
import {Upper} from "../../gui/WidgetContainer";

class Navigator extends Component {

    render() {
        return (
            <Upper>
                <p className={"disabled"}>
                    Keine Fehler im Dokument gefunden.
                </p>
            </Upper>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);