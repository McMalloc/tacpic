import styled from 'styled-components';
import React, {Component} from "react";
import {createPortal} from "react-dom";
import {fadeIn, slideFromAbove} from "./Animations";
import {Icon} from "./_Icon";
import {Button} from "./Button";

const Backdrop = styled.div`
  background-color: rgba(3,113,113,0.3);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.1s ease-in;
  cursor: zoom-out;
`;

const Window = styled.div`
  box-shadow: -1px 1px 11px 0px rgba(0, 0, 0, 0.87); //${props => props.theme.distant_shadow};
  background-color: ${props => props.theme.background};
  animation: ${slideFromAbove} 0.1s ease-in;
  width: ${props=> props.fitted ? 'auto' : '100%'};
  margin: 20px;
  max-height: 90%;
  border-radius: ${props => props.theme.border_radius};
  display: flex;
  overflow: hidden;
  flex-direction: column;
  cursor: default;
  z-index: 100;
`;

const ModalHeader = styled.div`
  padding: ${props => props.theme.large_padding};
   border-bottom: 2px solid ${props => props.theme.grey_5};
  display: flex;
  flex: 0 0 auto;
  color: ${props => props.theme.brand_secondary_lighter};
`;

const ModalTitle = styled.h3`
  margin: 0;
  flex: 1 1 auto;
`;

const ModalClose = styled.div`
  font-size: 1.2em;
  flex: 0 0 0;
  cursor: pointer;
`;

const ModalContent = styled.div`
  padding: ${props => props.noPadding ? 0 : props.theme.large_padding};
  flex: 1 1 auto;
  display: flex; 
  overflow: hidden; 
`;

const ModalFooter = styled.div`
  border-top: 2px solid ${props => props.theme.grey_5};
  padding: ${props => props.theme.large_padding};
  flex: 0 0 auto;
  background-color: ${props => props.theme.background};
`;

class Modal extends Component {
    constructor(props) {
        super(props);
        // Create a div that we'll render the modal into. Because each
        // Modal component has its own element, we can render multiple
        // modal components into the modal container.
        this.el = document.createElement('div');
    }

    componentDidMount() {
        // Append the element into the DOM on mount. We'll render
        // into the modal container element (see the HTML tab).
        this.modalRoot = document.getElementById('modal');
        this.modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        // Remove the element from the DOM when we unmount
        this.modalRoot.removeChild(this.el);
    }

    render() {
        // Use a portal to render the children into the element
        return createPortal(
            <Backdrop onClick={this.props.dismiss}>
                <Window fitted={this.props.fitted} onClick={event=>event.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>{this.props.title}</ModalTitle>
                        {typeof this.props.dismiss === "function" && <ModalClose onClick={this.props.dismiss}><Icon icon={"times"} /></ModalClose>}
                        {/*<ModalClose>{typeof this.props.dismiss === "function" && <Icon onClick={this.props.dismiss} icon={"times"} />}</ModalClose>*/}
                    </ModalHeader>
                    <ModalContent noPadding={this.props.noPadding}>{this.props.children}</ModalContent>
                    {this.props.actions && this.props.actions.length !== 0 &&
                        <ModalFooter>{this.props.actions.map((action, index) => {
                            let buttonProps = {
                                primary: action.template === "primary",
                                icon: action.icon
                            };
                            // TODO: kein float fürs Layout nutzen
                            return (
                                <span key={index} style={{float: action.align}}>
                                    <Button disabled={action.disabled} {...buttonProps} onClick={action.action}>{action.label}</Button>
                                </span>
                            )
                        })}</ModalFooter>
                    }
                </Window>
            </Backdrop>,
            // A DOM element
            this.el,
        );
    }
}


export {Modal}