import React, {Component} from 'react';
import {connect} from "react-redux";
import {Alert} from "../../gui/Alert";

class Navigator extends Component {

    render() {
        return (
            <>
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
            </>
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