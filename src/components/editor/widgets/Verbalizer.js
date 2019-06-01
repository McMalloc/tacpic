import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import {Qid} from "../../gui/Qid";
import {Lower, Upper} from "../../gui/WidgetContainer";
import {Button} from "../../gui/Button";

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

class Verbalizer extends Component {
    constructor(props) {
        super(props);
        this.state = {assistant: false};
    }

    showAssistent = () => this.setState({assistant: true});
    hideAssistant = () => this.setState({assistant: false});

    render() {
        return (
            <>
                <Upper>
                    <Qid
                        title={this.props.title}
                        onChange={event => this.props.changeTitle(event.currentTarget.value)}
                    />
                </Upper>
                <Lower>
                    <Button primary>Einfügen</Button>
                </Lower>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        title: state.editor.openedFile.title
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeTitle: title => {
            dispatch({
                type: "CHANGE_TITLE",
                title
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Verbalizer);