import React, {Component} from 'react';
import {connect} from "react-redux";

class Pages extends Component {

    render() {
        console.log(this.props.openedFile.pages);
        return (
            <React.Fragment>
                {this.props.openedFile.pages.map((page, i) =>
                    <button key={i} onClick={() => this.props.changePage(i)}>
                        {page.name}
                    </button>
                )}
                <button onClick={() => this.props.addPage()}>
                    +
                </button>
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