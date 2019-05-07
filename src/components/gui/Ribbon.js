import styled from 'styled-components';
import React, {Component} from "react";
import {Icon} from "./_Icon";
import {withTranslation} from "react-i18next";

const Wrapper = styled.div`
  // color: ${props => props.theme.accent_1_light};
  background-color: ${props => props.theme.accent_1_light};
  width: ${props => props.collapsed ? "50px" : "150px"};
  display: flex;
  flex-direction: column;
  margin-right: 1em;
  padding-top: 15%;
  // box-shadow: ${props => props.theme.middle_shadow};
  
  &:hover > button {
    opacity: 1;
  }
`;

const Label = styled.span`
  font-size: 0.9em;
  margin-top: 0.5em;
  display: ${props => props.show ? "flex" : "none"};
`;

const RibbonItem = styled.button`
  border: none;
  border-bottom: 1px solid ${props => props.theme.accent_1};
  
  &:first-child {
    border-top: 1px solid ${props => props.theme.accent_1};
  }
  
  background-color: ${props => props.active ? props.theme.accent_1 : "transparent"};
  color: ${props => props.active ? props.theme.accent_1_light : props.theme.dark};
  height: 60px;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  font-size: 0.9em;
  font-weight: 700;
  padding: 0.5em 0;
  //opacity: ${props => props.active ? "1" : "0.7"};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.accent_1 : props.theme.background};
  }  
  
  &:focus {
    background-color: ${props => props.theme.accent_1};
  }
  
  // &:after {
  //   border-right: 49px solid ${props => props.theme.background};
  //   border-top: 49px solid transparent;
  //   border-left: 49px solid transparent;
  //   border-bottom: 49px solid transparent;
  //   display: flex;
  //   //background-color: ${props => props.theme.background};
  //   transform: scale(0.3, 1);
  //   position: absolute;
  //   right: -35px;
  //   top: 0;
  //   //border-radius: 100%;
  //   //width: 40px;
  //   //height: 100%;
  //   content: ${props => props.active ? "''" : "none"};
  // }
`;

const BigIcon = styled(Icon)`
  
`;

const Arrow = styled.svg`

`;

class Ribbon extends Component {
    state = {
        collapsed: false
    };

    collapse = () => {
        this.setState({collapsed: true});
    };

    expand = () => {
        this.setState({collapsed: false});
    };

    render() {
        // Use a portal to render the children into the element
        return (
            <Wrapper collapsed={this.state.collapsed}>
                {this.props.menus.map((item, index) => {
                    return (
                        <RibbonItem
                            key={index}
                            active={index === this.props.activeItem}
                            onClick={() => {
                                item.action(); this.setState({activeItem: index})
                            }}>
                            <Icon icon={item.icon}/>  <Label show={!this.state.collapsed}>{this.props.t(item.label)}</Label>
                        </RibbonItem>
                    )
                })}
                {this.props.children}
                {/*{!this.state.collapsed &&*/}
                    {/*<button onClick={this.collapse}>Einklappen</button>*/}
                {/*}*/}
                {/*{this.state.collapsed &&*/}
                    {/*<button onClick={this.expand}>Ausklappen</button>*/}
                {/*}*/}

            </Wrapper>


        )
    }
}

export default withTranslation()(Ribbon);