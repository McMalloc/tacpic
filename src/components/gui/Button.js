import styled from 'styled-components';
import React, {Component} from "react";
import {fadeIn, slideFromAbove} from "./Animations";
import {useTranslation} from 'react-i18next';

const Label = styled.span`
  // padding: ${props => props.noPad ? 0 : props.theme.large_padding} ${props => props.noPad ? 0 : props.primary ? "16px" : props.theme.large_padding};
  padding-left: ${props => props.icon ? props.theme.spacing[2] : 0};
  display: inline-block;
`;

const Icon = styled.span`
  //padding: ${props => props.theme.spacing[2]};
  display: inline-block;
`;

const ButtonBase = styled.button`
  background-color: ${props => props.primary ? props.theme.brand_secondary : "transparent"};
  color: ${props => props.primary ? props.theme.background : "inherit"};
  border: 1px solid ${props => props.theme.middark};
  padding: ${props => props.theme.spacing[2]};
  border-radius: 3px;
  cursor: pointer;
  margin-top: 0;
  position: relative;
  font-size: 0.9em;
  width: ${props => props.fullWidth ? "100%" : "auto"};
  transition: box-shadow 0.15s cubic-bezier(0.19, 1, 0.22, 1), background-color 0.15s;
  
  &:hover {
      background-color: ${props => props.primary ? props.theme.accent_1 : props.theme.light};
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
    const { t } = useTranslation();
    return (
        <ButtonBase type={"button"} ref={ref} {...props}>
            {props.icon &&
            <Icon primary={props.primary}>
                <i className={"fas fa-" + props.icon}/>
            </Icon>
            }
            {props.children &&
            <Label icon={props.icon}>
                {t(props.children)}
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
  box-shadow: ${props => props.theme.middle_shadow};
  padding: 1em;
  border: 1px solid ${props => props.theme.accent_1_light};
  width: auto;

  position: absolute;
  top: 1.5em;
  right: ${props => props.rightAlign ? 0 : "inherit"};
  left: ${props => props.rightAlign ? "inherit" : 0};
  z-index: 9998;
  animation: ${fadeIn} 0.1s ease-in, ${slideFromAbove} 0.1s ease-in;
  
  // &:before { // Pfeil
  //   content: '';
	// position: absolute;
	// top: 1px;
	// right: ${props => props.rightAlign ? "1em" : "inherit"};
  //   left: ${props => props.rightAlign ? "inherit" : "1em"};
	// width: 0;
	// height: 0;
	// border: 0.8em solid transparent;
	// border-bottom-color: ${props => props.theme.background};
	// border-top: 0;
	// margin-left: -0.8em;
	// margin-top: -0.8em;
  // }
`;


/* TODO:
    * toggle() wird zweimal aufgerufen bei einem Klick auf den Button, führt zu Fehler bei focus()
    * Nach Öffnen des Flyouts sollte das erste Element mit tabindex fokussiert werden, nicht das Menü selbst
    * das Menü auf Touchgeräten schließen, wenn außerhalb berührt wird (vgl. https://stackoverflow.com/questions/13492881/why-is-blur-event-not-fired-in-ios-safari-mobile-iphone-ipad)
    * WIA-ARIA
*/
class FlyoutButton extends Component {
    state = {
        out: false
    };
    eventTimer = -1;

    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.flyoutRef = React.createRef();
    }

    onBlurHandler = () => {
        this.eventTimer = setTimeout(() => this.close(), 0);
    };

    onFocusHandler = () => {
        if (this.eventTimer > 0) {
            clearTimeout(this.eventTimer);
            this.eventTimer = -1;
        }
    };

    toggle = () => {
        if (this.state.out) {
            this.state.out ? this.close() : this.open();
        } {
            this.state.out ? this.close() : this.open();
            // the timer will fire after the current render cycle, so the ref is actually in the dom after the flag went true
            setTimeout(() => this.flyoutRef.current.focus(), 0);
        }
    };

    close = () => {
        this.setState(() => { return {out: false} });
    };

    open = () => {
        this.setState(() => { return {out: true} });
    };

    render() {
        return (
            <span className={this.props.className} style={{position: "relative"}}>
                <Button noPad={this.props.noPad} onBlur={this.onBlurHandler} onFocus={this.onFocusHandler} ref={this.buttonRef} onClick={this.toggle}>
                    {this.props.label}
                    <Caret down={this.state.out}><i className={"fas fa-caret-down"} /></Caret>
                </Button>
                {this.state.out &&
                    <Flyout
                        tabIndex={-1}
                        onBlur={this.onBlurHandler}
                        onFocus={this.onFocusHandler}
                        rightAlign={this.props.rightAlign || false}
                        ref={this.flyoutRef}>
                        {this.props.children}
                    </Flyout>
                }
            </span>
        )

    }
}

export {FlyoutButton, Button, ButtonBase}