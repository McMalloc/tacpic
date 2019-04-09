import styled from 'styled-components';
import React, {Component} from "react";
import {createPortal} from "react-dom";
import {fadeIn, slideFromAbove} from "./Animations";
import {Icon} from "./_Icon";
import {Button} from "./Button";

const Backdrop = styled.div`
  //background-color: rgba(0,0,0,0.4);
  background-color: rgba(3,113,113,0.3);
  //background-color: rgba(255,255,255,0.9);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.1s ease-in;
`;

const Window = styled.div`
  box-shadow: ${props => props.theme.middle_shadow};
  background-color: ${props => props.theme.background};
  animation: ${slideFromAbove} 0.1s ease-in;
  max-width: 600px;
  margin: auto;
  max-height: 90%;
  border-radius: ${props => props.theme.border_radius};
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: ${props => props.theme.large_padding};
  //border-bottom: 2px solid ${props => props.theme.accent_1};
   border-bottom: 2px solid ${props => props.theme.accent_1_light};
  display: flex;
  flex: 0 0 auto;
  color: ${props => props.theme.accent_1};
`;

const ModalTitle = styled.h3`
  //font-weight: 700;
  margin: 0;
  flex: 1 1 auto;
  //font-size: 1.2em;
`;

const ModalClose = styled.div`
  font-size: 1.2em;
  flex: 0 0 0;
  cursor: pointer;
  //border-left: 2px solid ${props => props.theme.accent_1_light};
`;

const ModalContent = styled.div`
  padding: ${props => props.theme.large_padding};
  overflow-y: scroll;
  overflow-x: auto;
  //box-shadow: inset 0 0 8px rgba(0,0,0,0.4);
  //flex: 1 100% auto;
`;

const ModalFooter = styled.div`
  // border-top: 2px solid ${props => props.theme.accent_1};
  border-top: 2px solid ${props => props.theme.accent_1_light};
  padding: ${props => props.theme.large_padding};
  flex: 0 0 auto;
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
            <Backdrop>
                <Window>
                    <ModalHeader>
                        <ModalTitle>{this.props.title}</ModalTitle>
                        {typeof this.props.dismiss === "function" && <ModalClose onClick={this.props.dismiss}><Icon icon={"times"} /></ModalClose>}
                        {/*<ModalClose>{typeof this.props.dismiss === "function" && <Icon onClick={this.props.dismiss} icon={"times"} />}</ModalClose>*/}
                    </ModalHeader>
                    <ModalContent>{this.props.children}</ModalContent>
                    <ModalFooter>{this.props.actions.map((action, index) => {
                        let buttonProps = {
                            primary: action.template === "primary"
                        };
                        // TODO: kein float fürs Layout nutzen
                        return (
                            <span key={index} style={{float: action.align}}>
                                <Button {...buttonProps} onClick={action.action}>{action.label}</Button>
                            </span>
                        )
                    })}</ModalFooter>
                </Window>
            </Backdrop>,
            // A DOM element
            this.el,
        );
    }
}


export {Modal}