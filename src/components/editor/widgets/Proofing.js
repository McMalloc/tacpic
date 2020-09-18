import React, {Component} from 'react';
import {connect} from "react-redux";
import {Treeview} from "../../gui/Treeview";
import {WidgetWrapper} from "../../gui/WidgetContainer";
import {Alert} from "../../gui/Alert";
import {Checkbox} from "../../gui/Checkbox";

class Navigator extends Component {

    render() {
        return (
            <WidgetWrapper>
                {this.props.titleValid ?
                    <p className={"disabled"}>
                        Keine Fehler im Dokument gefunden.
                    </p>
                    :
                    <Alert warning>
                        Dem Dokument fehlt noch ein aussagekräftiger Titel.
                    </Alert>}

                    {/*<Checkbox label={"nur Relief"} />*/}
                    {/*<Checkbox label={"nur Druck"} />*/}
                    {/*<Checkbox label={"beides"} />*/}
            </WidgetWrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        titleValid: state.editor.file.title.length !== 0
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);