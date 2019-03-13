import React, {Component} from 'react';
import {connect} from "react-redux";
import {Button} from "../../gui/Button";

class Pages extends Component {

    render() {
        return (
            <React.Fragment>
                {this.props.openedFile.pages.map((page, i) =>
                    <Button key={i} onClick={() => this.props.changePage(i)}>
                        {page.name}
                    </Button>
                )}
                <Button onClick={() => this.props.addPage()}>
                    +
                </Button>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        openedFile: state.editor.openedFile
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePage: nr => {
            dispatch({
                type: "PAGE_CHANGE",
                number: nr
            })
        },
        addPage: () => {
            dispatch({
                type: "PAGE_ADD"
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Pages);