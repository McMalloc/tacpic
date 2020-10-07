import styled, {useTheme} from 'styled-components/macro';
import React, {Component, useRef, useState} from "react";
import {fadeIn, slideFromAbove} from "./Animations";
import {useTranslation} from 'react-i18next';
import {Icon} from "./_Icon";
import {createPortal} from "react-dom";

const Label = styled.span`
  // padding: ${props => props.noPad ? 0 : props.theme.large_padding} ${props => props.noPad ? 0 : props.primary ? "16px" : props.theme.large_padding};
  padding-left: ${props => props.icon ? (props.large ? props.theme.spacing[3] : props.theme.spacing[2]) : 0};
  display: inline-block;
`;

// const Icon = styled.span`
//   //padding: ${props => props.theme.spacing[2]};
//   display: inline-block;
// `;

const ButtonBase = styled.button`
  background-color: ${props => props.primary ? props.theme.brand_secondary : "white"};
  color: ${props => props.primary ? props.theme.background : "inherit"};
  border: 1px solid ${props => props.theme.middark};
  padding: ${props => props.small ? 0 : (props.large ? "8px 18px" : `${props.theme.spacing[1]} ${props.theme.spacing[2]}`)};
  text-transform: ${props => props.small ? 'uppercase' : 'none'};
  border-radius: 3px;
  cursor: pointer;
  float: ${props => props.rightAction ? 'right' : 'none'};
  margin-top: 0;
  position: relative;
  font-size: ${props => props.small ? '0.8em' : '1em'};
  width: ${props => props.fullWidth ? "100%" : "auto"};
  transition: box-shadow 0.15s cubic-bezier(0.19, 1, 0.22, 1), background-color 0.15s;
  display: inline-flex;
  justify-content: ${props => props.leftAlign ? 'left' : "center"};
  
  &:disabled {
    color: ${props => props.theme.grey_0};
    text-shadow: 1px 1px 0 white;
    box-shadow: 1px 1px 0 white inset;
    background:url(
        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVQYV2M8derUf21tbQYYuHr1KgPj169f/yMLgNhwQZAKEADpAgsiC4BVgsyEqYAZAwAYXB5aB8AaFAAAAABJRU5ErkJggg==
        ) repeat;
    opacity: 0.7;
    border-color: ${props => props.theme.grey_3};
    cursor: not-allowed;
    
    &:hover {
      box-shadow: none;
    }
  }
  
  &:hover:not(:disabled) {
      background-color: ${props => props.primary ? props.theme.brand_secondary_lighter : props.theme.light};
      box-shadow: ${props => props.theme.middle_shadow};
      ${Label} {
        text-decoration: underline;
      }
  }

  &:active {    
    box-shadow: none;
  }
  
  &:focus {
    //outline: 4px dashed rgba(44,47,255,0.4); //todo: Stile für hohe Barrierearmut
  }
`;

// die ref muss heruntergereicht werden, da noch ein styled-component dazwischen steht
const Button = React.forwardRef((props, ref) => {
    const {t} = useTranslation();
    const label = props.label || props.children;
    const theme = useTheme();
    return (
        <ButtonBase theme={theme} type={props.type || "button"} ref={ref} {...props}>
            {props.icon &&
            <Icon icon={props.icon} primary={props.primary}/>
            }
            {label &&
            <Label icon={props.icon}>
                {t(label)}
                {props.isDropdown &&
                <Caret><i className={"fas fa-caret-down"}/></Caret>
                }
            </Label>
            }
        </ButtonBase>
    )
});

const Caret = styled.span`
  margin-left: 0.5em;
  display: inline-block;
  transition: transform 0.1s;
  position: relative;
  transform: translate(0, ${props => props.down ? "1em" : 0}) scale(${props => props.down ? 2 : 1});
  z-index: ${props => props.down ? 9999 : "inherit"};
`;

const Flyout = styled.div`
  background-color: ${props => props.theme.background};
  border-radius: ${props => props.theme.border_radius};
  box-shadow: ${props => props.theme.very_distant_shadow};
  border: 1px solid ${props => props.theme.foreground};
  min-width: 100%;
  
  .flyout-entry {
    width: ${props => props.flyoutWidth ? props.flyoutWidth + "px" : "auto"};
  }

  position: absolute;
  top: 1.5em;
  right: ${props => props.rightAlign ? 0 : "inherit"};
  left: ${props => props.rightAlign ? "inherit" : 0};
  z-index: 9998;
  animation: ${fadeIn} 0.1s ease-in, ${slideFromAbove} 0.1s ease-in;
`;

const FlyoutEntryWrapper = styled.div`
  padding: ${props => props.theme.base_padding} ${props => props.theme.large_padding};
  cursor: pointer;
  transition: background-color 0.1s, color 0.1s;
  
  label {
    margin-left: 1em;
  }
  
  &:hover {
    label {
      text-decoration: underline;
    }
    background-color: ${props => props.theme.grey_6};
    //color: white;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.foreground};
  }
`;

export const FlyoutEntry = props => {
    const {t} = useTranslation();
    return (
        <FlyoutEntryWrapper className={"flyout-entry"} tabIndex={0} role={"button"} onClick={props.onClick}>
            <Icon icon={props.icon}/><label>{t(props.label)}</label>
            {props.sublabel && <>
                <br/><small>{t(props.sublabel)}</small>
            </>}
        </FlyoutEntryWrapper>
    )
}

/* TODO:
    * toggle() wird zweimal aufgerufen bei einem Klick auf den Button, führt zu Fehler bei focus()
    * Nach Öffnen des Flyouts sollte das erste Element mit tabindex fokussiert werden, nicht das Menü selbst
    * das Menü auf Touchgeräten schließen, wenn außerhalb berührt wird (vgl. https://stackoverflow.com/questions/13492881/why-is-blur-event-not-fired-in-ios-safari-mobile-iphone-ipad)
    * WIA-ARIA
*/
const FlyoutButton = props => {
    const [out, setOut] = useState(false)
    let eventTimer = -1;

    const buttonRef = useRef();
    const flyoutRef = useRef();

    const toggle = () => {
        if (out) {
            out ? setOut(false) : setOut(true);
        } else { // TODO else war vorher weg, könnte jetzt einen Fehler beherbergen
            out ? setOut(false) : setOut(true);
            // the timer will fire after the current render cycle, so the ref is actually in the dom after the flag went true
            setTimeout(() => flyoutRef.current !== null && flyoutRef.current.focus(), 0);
        }
    };

    const onBlurHandler = () => eventTimer = setTimeout(() => setOut(false), 10);
    const onFocusHandler = () => {
        if (eventTimer > 0) {
            clearTimeout(eventTimer);
            eventTimer = -1;
        }
    };

    return (
        <span className={props.className} style={{position: "relative"}}>
                <Button isDropdown={true}
                        icon={props.icon}
                        noPad={props.noPad}
                        onBlur={onBlurHandler}
                        onFocus={onFocusHandler}
                        ref={buttonRef}
                        onClick={toggle}>
                    {props.label}
                </Button>
            {out &&
            <Flyout
                tabIndex={-1}
                flyoutWidth={props.flyoutWidth}
                onBlur={onBlurHandler}
                onFocus={onFocusHandler}
                rightAlign={props.rightAlign || false}
                ref={flyoutRef}>
                {props.children}
            </Flyout>//, document.getElementById("flyout"))
            }
            </span>
    )
}

export {FlyoutButton, Button, ButtonBase}