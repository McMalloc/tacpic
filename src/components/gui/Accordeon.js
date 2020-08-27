import styled, {ThemeContext} from 'styled-components';
import React, {useContext, useState} from "react";
import {Icon} from "./_Icon";
import Toggle from "./Toggle";
import {CSSTransition} from 'react-transition-group';

const Wrapper = styled.div`

`;

const AccordeonPanelWrapper = styled.div`
  border-bottom: 2px solid ${props => props.theme.brand_secondary_light};
`;

const AccordeonPanelContent = styled.div`
  background-color: ${props => props.theme.grey_6};
`;

const AccordeonPanelTitle = styled.div`
  color: ${props => props.theme.background};
  background-color: ${props => props.collapsed ? props.theme.brand_secondary : props.theme.brand_secondary_lighter};
  cursor: pointer;
  padding: ${props => props.theme.base_padding};
  position: relative;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.brand_secondary_lighter};
    span {
      text-decoration: underline;
    }
  }
  
  span {
    margin-left: 12px;
  }
  
  i {
    position: absolute;
    left: 12px;
    top: 6px;
    transform: rotate(${props => props.collapsed ? 0 : "90deg"});
    transition: transform 0.2s;
  }
`;

const Message = styled.div`

`;

const AccordeonPanelButtonWrapper = styled.div`
  position: relative;
`;

const AccordeonPanelButton = styled.button`
`;

const AccordeonMenuEntry = styled.div`
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.brand_primary : 'transparent'};
  background-color: ${props => props.active ? props.theme.background : 'inherit'}!important;
  text-decoration: ${props => props.active ? 'underline' : 'inherit'};
  padding: 4px;
  align-items: center;
  display: flex;
  transition: background-color 0.1s, border-color 0.1s;
  
  &:hover {
    text-decoration: underline;
    background-color: ${props => props.theme.background};
  }
`;

const AccordeonPanelFlyout = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  z-index: 1;
  min-width: 300px;
  background-color: ${props => props.theme.grey_6};
  padding: ${props => props.theme.large_padding};
  border: 2px solid ${props => props.theme.brand_secondary_light};
  border-radius: ${props => props.theme.border_radius};
  box-shadow: ${props => props.theme.distant_shadow};
  
  &.slidein-enter, &.slidein-appear {
    transform: translateX(-50px);
    opacity: 0;
  }

  &.slidein-enter-active, &.slidein-appear-active {
    transform: translateX(0);
    opacity: 1;
    transition: opacity 100ms, transform 100ms;
  }

  &.slidein-exit {
    transform: translateX(0);
    opacity: 1;
  }

  &.slidein-exit-active {
    transform: translateX(-50px);
    opacity: 0;
    transition: opacity 100ms, transform 100ms;
  }
`;

const AccordeonPanelFlyoutButton = props => {
    return (
        <AccordeonPanelButtonWrapper className={props.className}>
            {props.genericButton ?
                <>{props.genericButton}</>
                :
                <Toggle leftAlign toggled={props.flownOut} onClick={props.onClick} fullWidth label={props.label}
                        icon={props.icon}/>
            }
            <CSSTransition classNames={"slidein"} in={props.flownOut} timeout={100} appear unmountOnExit>
                <AccordeonPanelFlyout>{props.children}</AccordeonPanelFlyout>
            </CSSTransition>
        </AccordeonPanelButtonWrapper>
    )
};

const AccordeonPanel = props => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <AccordeonPanelWrapper>
            <AccordeonPanelTitle collapsed={collapsed} onClick={() => setCollapsed(!collapsed)}>
                <Icon icon={"caret-right"}/>
                <span>{props.title}</span>
            </AccordeonPanelTitle>
            <AccordeonPanelContent>
                {!collapsed && props.children}
            </AccordeonPanelContent>
        </AccordeonPanelWrapper>
    )
};

const Accordeon = props => {
    return (
        <Wrapper>
            {props.children}
        </Wrapper>
    )
};

export {Accordeon, AccordeonPanel, AccordeonPanelFlyoutButton, AccordeonMenuEntry}
// const Flyout = props => {
//       return <div></div>
// };

