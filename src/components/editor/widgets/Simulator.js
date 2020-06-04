import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components/macro';
import {Qid} from "../../gui/Qid";

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

class Simulator extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
               Simulator
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

export default connect(mapStateToProps, mapDispatchToProps)(Simulator);