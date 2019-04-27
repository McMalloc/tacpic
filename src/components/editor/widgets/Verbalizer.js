import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import {Qid} from "../../gui/Qid";

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
            <React.Fragment>
               <Qid/>
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Verbalizer);