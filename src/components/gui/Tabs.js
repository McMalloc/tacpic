import styled from 'styled-components';
import React, {Component, Fragment} from "react";
import {Icon} from "./_Icon";

const TabBar = styled.div`
  border-bottom: 2px solid ${props => props.theme.accent_1};
  box-sizing: content-box;
  margin-bottom: ${props => props.theme.large_padding}
  background-color: ${props => props.theme.accent_1_light};
`;

const TabItem = styled.button`
  background-color: ${props => props.active ? props.theme.background : "transparent"};
  cursor: pointer;
  font-size: ${props => props.theme.font_size_ui};
  color: ${props => props.active ? props.theme.accent_1 : "inherit"};
  font-weight: ${props => props.active ? "700" : "inherit"};
  padding: ${props => props.theme.large_padding};
  display: inline-block;
  position: relative;
  border: none;
  border-right: 1px solid ${props => props.theme.midlight};
  box-shadow: ${props => props.active ? props.theme.middle_shadow : "none"};
  transition: background-color 0.15s;
  
  &:hover {
      background-color: ${props => props.theme.light};
  }
  
  &:after {
    content: " ";
    position: absolute;
    display: block;
    height: 4px;
    left: 0;
    right: 0;
    bottom: -3px;
    background-color: ${props => props.active ? props.theme.background : "transparent"};
  }
`;

// const TabContent = styled.div`
//
// `;

class TabPane extends Component {
    state = {
        active: 0
    };

    clickHandler = (tabIndex) => {
        this.setState(() => {return {active: tabIndex}});
    };

    render() {
        // let currentPage = <InteractiveSVG />;
        return <Fragment>
            <TabBar role={"tablist"}>
                {this.props.tabs.map((tab, index) => {
                    return (
                        <TabItem tabIndex={1} role={"tab"} active={this.state.active === index} key={index} onClick={() => this.clickHandler(index)}>
                            <Icon icon={tab.icon} />
                            {tab.label}
                        </TabItem>);
                })}
            </TabBar>
            <div>
                {this.props.tabs[this.state.active].content}
            </div>
        </Fragment>
    }
}

export {TabPane}