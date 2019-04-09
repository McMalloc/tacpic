import styled from 'styled-components';
import React, {Component} from "react";
import {Icon} from "./_Icon";

const Wrapper = styled.div`
  color: ${props => props.theme.accent_1_light};
  background-color: ${props => props.theme.brand_secondary};
  width: ${props => props.collapsed ? "50px" : "150px"};
  display: flex;
  flex-direction: column;
  margin-right: 1em;
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
  background-color: inherit;
  color: white;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  font-size: 1.2em;
  padding: 0.5em 0;
  opacity: ${props => props.active ? "1" : "0.7"};
  cursor: pointer;
  
  &:hover, &:focus {
    background-color: ${props => props.theme.accent_1};
  }
  
  &:after {
    border-right: 49px solid ${props => props.theme.background};
    border-top: 49px solid transparent;
    border-left: 49px solid transparent;
    border-bottom: 49px solid transparent;
    display: flex;
    //background-color: ${props => props.theme.background};
    transform: scale(0.3, 1);
    position: absolute;
    right: -35px;
    top: 0;
    //border-radius: 100%;
    //width: 40px;
    //height: 100%;
    content: ${props => props.active ? "''" : "none"};
  }
`;

const BigIcon = styled(Icon)`
  
`;

const Arrow = styled.svg`

`;

class Ribbon extends Component {
    constructor(props) {
        super(props);
        this.state = {activeItem: 0, collapsed: false};
        this.collapse = this.collapse.bind(this);
        this.expand = this.expand.bind(this);
    }

    collapse() {
        this.setState({collapsed: true});
    }

    expand() {
        this.setState({collapsed: false});
    }

    render() {
        // Use a portal to render the children into the element
        return (
            <Wrapper collapsed={this.state.collapsed}>
                {this.props.menus.map((item, index) => {
                    return (
                        <RibbonItem
                            key={index}
                            active={index === this.state.activeItem}
                            onClick={() => {
                                item.action(); this.setState({activeItem: index})
                            }}>
                            <Icon icon={item.icon + " fa-2x"}/>  <Label show={!this.state.collapsed}>{item.label}</Label>
                        </RibbonItem>
                    )
                })}
                {this.props.children}
                {!this.state.collapsed &&
                    <button onClick={this.collapse}>Einklappen</button>
                }
                {this.state.collapsed &&
                    <button onClick={this.expand}>Ausklappen</button>
                }

            </Wrapper>


        )
    }
}

export {Ribbon}