import styled from 'styled-components/macro';
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { fadeIn, slideFromAbove } from "./Animations";
import { Button } from "./Button";
import { SM_SCREEN, MD_SCREEN, LG_SCREEN } from "../../config/constants"
import { Icon } from './_Icon';
import { useState } from 'react';

const PopupContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;

  animation: ${slideFromAbove} 0.1s ease-in;
  
  background-color: ${({ theme }) => theme.brand_secondary};
  padding: 1rem;
  color: ${({ theme }) => theme.background};
  border-radius: ${({ theme }) => theme.border_radius};
  box-shadow: ${({ theme }) => theme.very_distant_shadow};
  padding-left: 3rem;
  max-width:  min(400px, 100vw);
  box-sizing: border-box;

  a {
    color: ${({ theme }) => theme.background};
  }
`;

const IconContainer = styled.div`
  color: ${({ theme }) => theme.brand_primary};
  position: absolute;
  left: 0.7rem;
  font-size: 1.5rem;
  min-height: 6rem;
`;

const ContentWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const Popup = props => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), props.delay * 1000)
  }, [props.children]);

  if (!show) return null;

  return createPortal(
    <PopupContainer>
      {!!props.icon &&
        <IconContainer>
          <Icon icon={props.icon} />
        </IconContainer>

      }
      <ContentWrapper>
        {props.children}
      </ContentWrapper>



    </PopupContainer>,
    // A DOM element
    document.getElementById('popup'),
  );
};

export default Popup;