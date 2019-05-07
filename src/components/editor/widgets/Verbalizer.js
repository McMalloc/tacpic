import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import {Qid} from "../../gui/Qid";
import {Upper} from "../../gui/WidgetContainer";

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
            <Upper>
               <Qid/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Verbalizer);