import React, {Component} from 'react';
import {connect} from "react-redux";
import {Treeview} from "../../gui/Treeview";
import {Upper} from "../../gui/WidgetContainer";
import {Alert} from "../../gui/Alert";

class Navigator extends Component {

    render() {
        return (
            <Upper>
                {this.props.titleValid ?
                    <p className={"disabled"}>
                        Keine Fehler im Dokument gefunden.
                    </p>
                    :
                    <Alert warning>
                        Dem Dokument fehlt noch ein aussagekräftiger Titel.
                    </Alert>}
            </Upper>
        );
    }
}

const mapStateToProps = state => {
    return {
        titleValid: state.editor.openedFile.title.length !== 0
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);