import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components/macro';
import {Qid} from "../../gui/Qid";
import {Lower, Upper} from "../../gui/WidgetContainer";
import {Button} from "../../gui/Button";

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

class Comments extends Component {
    constructor(props) {
        super(props);
    }

    showAssistent = () => this.setState({assistant: true});
    hideAssistant = () => this.setState({assistant: false});

    render() {
        return (
            <>
                <Upper>
                    <p className={"disabled"}>
                        Noch keine Kommentare.
                    </p>
                </Upper>
                <Lower>
                    <Button disabled icon={"trash-alt"} onClick={() => {}}>Entfernen</Button> &ensp;
                    <Button primary icon={"plus"} onClick={() => {}}>Kommentar verfassen</Button>
                    {/*<Button primary icon={"plus"} onClick={() => this.props.addPage()}>Kommentar verfassen</Button>*/}
                </Lower>
            </>

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

export default connect(mapStateToProps, mapDispatchToProps)(Comments);