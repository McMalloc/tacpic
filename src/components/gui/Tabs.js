import styled from 'styled-components';
import React, {Component, Fragment} from "react";
import {Icon} from "./_Icon";
import {withTranslation} from "react-i18next";

const TabBar = styled.div`
  border-bottom: 1px solid ${props => props.theme.brand_secondary_light};
  box-sizing: content-box;
  display: flex;
  margin-bottom: ${props => props.theme.spacing[3]};
  //background-color: ${props => props.theme.brand_secondary_light};
`;

const TabItem = styled.button`
  
  background-color: transparent;
  // background-color: ${props => props.active ? props.theme.background : "transparent"};
  cursor: pointer;
  font-size: ${props => props.theme.font_size_ui};
  color: ${props => props.active ? props.theme.brand_secondary : "inherit"};
  font-weight: ${props => props.active ? "700" : "inherit"};
  padding: ${props => props.theme.spacing[2]};
  position: relative;
  border: 1px solid ${props => props.active ? props.theme.brand_secondary_light : "transparent"};
  border-bottom: none;
  //border-right: 1px solid ${props => props.theme.midlight};
  box-shadow: ${props => props.active ? props.theme.middle_shadow : "none"};
  transition: background-color 0.15s;
  border-radius: 3px 3px 0 0;
  
  &:hover {
      background-color: ${props => props.active ? "inherit" : props.theme.light};
  }
  
  &:after {
    content: " ";
    position: absolute;
    display: block;
    height: 4px;
    left: 0;
    right: 0;
    bottom: -3px;
    background-color: ${props => props.active ? "#f5f5f5" : "transparent"};
  }
`;

class TabPane extends Component {
    state = {
        active: 0
    };

    clickHandler = (tabIndex) => {
        this.setState(() => {return {active: tabIndex}});
    };

    render() {
        return <Fragment>
            <TabBar role={"tablist"}>
                {this.props.tabs.map((tab, index) => {
                    return (
                        <TabItem tabIndex={1} role={"tab"} active={this.state.active === index} key={index} onClick={() => this.clickHandler(index)}>
                            <Icon icon={tab.icon} />
                            {this.props.t(tab.label)}
                        </TabItem>);
                })}
            </TabBar>
            <div>
                {this.props.tabs[this.state.active].content}
            </div>
        </Fragment>
    }
}

export default withTranslation()(TabPane)