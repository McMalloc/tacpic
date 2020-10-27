import styled from 'styled-components/macro';
import React, {useContext, useEffect, useRef, useState} from "react";
import {Icon} from "./_Icon";
import Toggle from "./Toggle";
import {CSSTransition} from 'react-transition-group';
import {getViewport} from "../../utility/viewport";
import {createPortal} from "react-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccordeonPanelWrapper = styled.div`
  //border-bottom: 2px solid ${props => props.theme.brand_secondary_light};
  //height: 100%;
  display: flex;
  flex-direction: column;
`;

const AccordeonPanelContent = styled.div`
   background-color: ${props => props.theme.grey_6};
  box-shadow: ${props => props.theme.middle_shadow} inset;
  flex: 1; 
  overflow: auto; 
  height: 100%;
  padding: 3px;
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

const AccordeonPanelButtonWrapper = styled.div`
  position: relative;
`;

const AccordeonMenuEntry = styled.div`
  cursor: pointer;
  min-height:12px;
  border: 2px solid ${props => props.active ? props.theme.brand_primary : 'transparent'};
  background-color: ${props => props.active ? props.theme.background : 'inherit'}!important;
  text-decoration: ${props => props.active ? 'underline' : 'inherit'};
  padding: 2px 4px;
  border-top: 2px solid ${props => props.hovered ? 'red' : 'inherit'};
  align-items: center;
  display: flex;
  user-select: none;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  transition: background-color 0.1s, border-color 0.1s;
  
  &:hover {
    text-decoration: underline;
    background-color: ${props => props.theme.background};
  }
`;

const AccordeonPanelFlyout = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  //z-index: 1;
  min-width: 200px;
  max-width: ${props => props.maxWidth ? props.maxWidth : 400}px;
  background-color: ${props => props.theme.grey_6};
  display: ${props => props.hideFlyout ? "none" : "block"};
  padding: ${props => props.theme.large_padding};
  border: 2px solid ${props => props.theme.brand_secondary_light};
  border-radius: ${props => props.theme.border_radius};
  box-shadow: ${props => props.theme.very_distant_shadow};
  transition: top 100ms, height 100ms;
  
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

export const useRedraw = () => { // TODO #935
    const [rerender, setRerender] = useState(0);
    const redraw = () => setRerender(rerender + 1);
    return [rerender, redraw];
}

const AccordeonPanelFlyoutButton = props => {
    // todo put in external component, border-avoiding container
    const panelRef = useRef(null);
    const buttonRef = useRef(null);
    useEffect(() => {
        if (!props.flownOut) return;
        if (panelRef.current === null) return;
        if (buttonRef.current === null) return;
        const {vw, vh} = getViewport();
        const buttonBBox = buttonRef.current.getBoundingClientRect();
        panelRef.current.style.left = (buttonBBox.left + buttonBBox.width) + "px";
        panelRef.current.style.top = buttonBBox.top + "px";
        const panelBBox = panelRef.current.getBoundingClientRect();
        if (vh < buttonBBox.top + panelBBox.height) {
            panelRef.current.style.top = `${vh - (panelBBox.top + panelBBox.height) - 36}px`;
        }
    }, [props.flownOut]);

    return (
        <AccordeonPanelButtonWrapper className={props.className}>

                {/*<pre>{JSON.stringify(pprops)}</pre>*/}
                {props.genericButton ?
                    <div ref={buttonRef}>{props.genericButton}</div>
                    :
                    <Toggle ref={buttonRef} leftAlign toggled={props.flownOut} onClick={props.onClick} fullWidth
                            label={props.label}
                            icon={props.icon}/>
                }
                {props.children && createPortal(<CSSTransition classNames={"slidein"} in={props.flownOut} timeout={100} appear unmountOnExit>
                    <AccordeonPanelFlyout maxWidth={props.maxWidth} hideFlyout={props.hideFlyout} ref={panelRef}>
                        {props.children}
                    </AccordeonPanelFlyout>
                </CSSTransition>, document.getElementById("flyout"))}

        </AccordeonPanelButtonWrapper>
    )
};

const AccordeonPanel = props => {
    // console.log(props.openedOverride);
    // const defaultState = props.openedOverride !== undefined && props.openedOverride ? props.openedOverride : localStorage.getItem(props.title + "_collapsed") === "true";
    const [collapsed, setCollapsed] = useState(localStorage.getItem(props.title + "_collapsed") === "false");
    // const [openedByOverride, setOpenedByOverride] = useState(localStorage.getItem(props.title + "_collapsed") === "false");

    // if (collapsed && props.openedOverride) {
    //     // setOpenedByOverride(true);
    //     setCollapsed(false);
    // }
    // console.log(props.children);
    return (
        <AccordeonPanelWrapper>
            <AccordeonPanelTitle collapsed={collapsed} onClick={() => {
                localStorage.setItem(props.title + "_collapsed", collapsed + "");
                setCollapsed(!collapsed)
            }}>
                <Icon icon={"caret-right"}/>
                <span>{props.title}</span>
            </AccordeonPanelTitle>
            {!collapsed &&
                <AccordeonPanelContent>
                    {props.children}
                </AccordeonPanelContent>
            }
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