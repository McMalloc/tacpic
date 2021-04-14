import styled from 'styled-components/macro';
import React, { Component, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { fadeIn, slideFromAbove } from "./Animations";
import { withTranslation } from 'react-i18next';
import { Button } from "./Button";
import { SM_SCREEN, MD_SCREEN, LG_SCREEN, KEYCODES } from "../../config/constants"
import { useTranslation } from 'react-i18next';

const Backdrop = styled.div`
  background-color: rgba(3,113,113,0.5);
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
  /* z-index: 1000; */
`;

const Window = styled.div`
  box-shadow: -1px 1px 11px 0px rgba(0, 0, 0, 0.87); //${props => props.theme.distant_shadow};
  background-color: ${props => props.theme.background};
  animation: ${slideFromAbove} 0.1s ease-in;
  transition: width 0.5s;

  margin: 0;
  ${SM_SCREEN} {
    margin: 20px;
    width: ${props => props.fitted ? 'auto' : '100%'};
  }
  ${MD_SCREEN} {
    width: ${props => props.fitted ? 'auto' : '70%'};
  }
  ${LG_SCREEN} {
    width: ${props => props.fitted ? 'auto' : '50%'};
  }
  max-height: 90%;
  transition: height 0.2s, width 0.2s;
  border-radius: ${props => props.theme.border_radius};
  display: flex;
  overflow: hidden;
  flex-direction: column;
  cursor: default;
  /* z-index: 100; */
`;

const ModalHeader = styled.div`
  padding: ${props => props.theme.large_padding};
   border-bottom: 2px solid ${props => props.theme.grey_5};
  display: flex;
  flex: 0 0 auto;
  color: ${props => props.theme.brand_secondary_lighter};
`;

const ModalTitle = styled.div`
  flex: 1 1 auto;
  font-weight: 700;
  font-size: 1.2rem;
`;

const ModalContent = styled.div`
  padding: ${props => props.noPadding ? 0 : props.theme.large_padding};
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto; 
`;

const ModalFooter = styled.div`
  border-top: 2px solid ${props => props.theme.grey_5};
  padding: ${props => props.theme.large_padding};
  flex: 0 0 auto;
  //background-color: ${props => props.theme.grey_5};
  background-color: ${props => props.theme.background};

  .modal-footer-button-container:not(:first-child) {
      margin-left: 1em;
  }
`;

// const Modal = props => {

//   let portalTarget = document.createElement('div');
//   let windowElement = useRef();

//   const { t } = useTranslation();
//   useEffect(() => {
//     console.log('MODAL MOUNT');
//     let modalRoot = document.getElementById('modal');
//     modalRoot.appendChild(portalTarget);
//     document.getElementById('root').setAttribute('aria-hidden', true);
//     windowElement.current.focus();

//     return () => {
//       console.log('MODAL UNMOUNT');
//       modalRoot.removeChild(portalTarget);
//       document.getElementById('root').setAttribute('aria-hidden', false);
//     };
//   }, [])

//   return createPortal(
//     <Backdrop id={"modal-backdrop"} onClick={props.dismiss}>
//       <Window
//         role={'dialog'} 
//         ref={windowElement}
//         tabIndex={0}
//         // onFocus={event=> {
//           // event.stopPropagation();
//           // if (!windowElement.current.contains(event.target)) windowElement.current.focus();
//         // }}
//         // aria-modal={true} 
//         aria-labelledby={"modal-title"} 
//         fitted={props.fitted} 
//         onClick={event => event.stopPropagation()}>
//         <ModalHeader>
//           <ModalTitle tabIndex={0} id={'modal-title'}>
//             {Array.isArray(props.title) ? t(props.title[0], props.title[1]) : t(props.title)}
//           </ModalTitle>
//           {typeof props.dismiss === "function" && <Button tabIndex={1000} onClick={props.dismiss} id={"close-modal-button"} title={'closeModal'} icon={"times"}></Button>}
//         </ModalHeader>
//         <ModalContent
//           // ref={firstFocusRef} 
//           aria-role={'document'}
//           noPadding={props.noPadding}>
//           {props.children}
//         </ModalContent>
//         {props.actions && props.actions.length !== 0 &&
//           <ModalFooter>{props.actions.map((action, index) => {
//             let buttonProps = {
//               primary: action.template === "primary",
//               icon: action.icon
//             };
//             // TODO: kein float fürs Layout nutzen
//             return (
//               <span key={index} className={'modal-footer-button-container'} style={{ float: action.align }}>
//                 <Button disabled={action.disabled} {...buttonProps}
//                   name={action.name}
//                   form={action.submitFor || undefined}
//                   onClick={action.action}>
//                   {action.label}
//                 </Button>
//               </span>
//             )
//           })}</ModalFooter>
//         }
//       </Window>
//     </Backdrop>,
//     // A DOM element
//     portalTarget,
//   )
// }
let handleKeyDown;
class Modal extends Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement('div');
    this.windowElement = React.createRef();
  }

  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    this.modalRoot = document.getElementById('modal');
    this.modalRoot.appendChild(this.el);
    this.windowElement.current.focus();
    document.getElementById('root').setAttribute('aria-hidden', true);
    let dismissFunc = this.props.dismiss;
    document.addEventListener('keydown', function handleKeyDown(event) {
      if (!!event.keyCode && event.keyCode === KEYCODES.ESC) {
        console.log(this.props);
        console.log(dismissFunc);
        dismissFunc();
      }
    });
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    this.modalRoot.removeChild(this.el);
    document.removeEventListener('keydown', handleKeyDown);
    document.getElementById('root').setAttribute('aria-hidden', false);
  }

  render() {
    // Use a portal to render the children into the element
    return createPortal(
      <Backdrop id={"modal-backdrop"} onClick={this.props.dismiss}>
        <Window 
          ref={this.windowElement} 
          role={'dialog'} 
          tabIndex={0}
          aria-labelledby={"modal-title"} 
          fitted={this.props.fitted} 
          onClick={event => event.stopPropagation()}>
          <ModalHeader>
            <ModalTitle id={'modal-title'}>
              {Array.isArray(this.props.title) ? this.props.t(this.props.title[0], this.props.title[1]) : this.props.t(this.props.title)}
            </ModalTitle>
            {typeof this.props.dismiss === "function" && <Button onClick={this.props.dismiss} id={"close-modal-button"} title={'close'} icon={"times"}></Button>}
            {/*<ModalClose>{typeof this.props.dismiss === "function" && <Icon onClick={this.props.dismiss} icon={"times"} />}</ModalClose>*/}
          </ModalHeader>
          <ModalContent ref={this.firstFocusRef} noPadding={this.props.noPadding}>{this.props.children}</ModalContent>
          {this.props.actions && this.props.actions.length !== 0 &&
            <ModalFooter>{this.props.actions.map((action, index) => {
              let buttonProps = {
                primary: action.template === "primary",
                icon: action.icon
              };
              // TODO: kein float fürs Layout nutzen
              return (
                <span key={index} className={'modal-footer-button-container'} style={{ float: action.align }}>
                  <Button disabled={action.disabled} {...buttonProps}
                    name={action.name}
                    form={action.submitFor || undefined}
                    onClick={action.action}>
                    {action.label}
                  </Button>
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


export default withTranslation()(Modal)