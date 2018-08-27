import React, {Component} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const TitleBar = styled.div`
  height: 15px;
  background-color: #6f42c1;
  color: white; 
  flex: 0 0 0;
`;

const Content = styled.div`
  flex: 1 1 100%;
  overflow: auto;
`;

class WidgetContainer extends Component {
    render() {
        const Component = this.props.component;
        return (
            <Wrapper>
                <TitleBar className="drag-handle">
                    {this.props.title}
                </TitleBar>
                <Content>
                    <Component/>
                </Content>
            </Wrapper>
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

export default connect(mapStateToProps, mapDispatchToProps)(WidgetContainer);