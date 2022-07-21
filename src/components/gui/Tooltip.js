import styled from 'styled-components/macro';
import React, { useState, useRef, createRef } from "react";
import { useTranslation } from "react-i18next";
import { useFloating, offset, flip, autoPlacement, shift } from '@floating-ui/react-dom';
import { useLayoutEffect } from 'react';

const TooltipElement = styled.div`
  /* display: none; */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
  animation: fadeInFromNone 0.2s ease-out;

  background-color: ${(props) => props.theme.foreground};
  color: ${(props) => props.theme.background};
  border-radius: ${(props) => props.theme.base_padding};
  padding: ${(props) => props.theme.base_padding};
  font-size: ${(props) => props.theme.font_size_ui};
  box-shadow: 5px 5px 15px rgba(0,0,0,0.4);

  a {
    color: ${(props) => props.theme.brand_secondary_verylight};
  }

  @-webkit-keyframes fadeInFromNone {
    0% {
        display: none;
        opacity: 0;
    }

    1% {
        display: block;
        opacity: 0;
    }

    100% {
        display: block;
        opacity: 1;
    }
}

@-moz-keyframes fadeInFromNone {
    0% {
        display: none;
        opacity: 0;
    }

    1% {
        display: block;
        opacity: 0;
    }

    100% {
        display: block;
        opacity: 1;
    }
}

@-o-keyframes fadeInFromNone {
    0% {
        display: none;
        opacity: 0;
    }

    1% {
        display: block;
        opacity: 0;
    }

    100% {
        display: block;
        opacity: 1;
    }
}

@keyframes fadeInFromNone {
    0% {
        display: none;
        opacity: 0;
    }

    1% {
        display: block;
        opacity: 0;
    }

    100% {
        display: block;
        opacity: 1;
    }
}
`

const Tooltip = props => {
  const { x, y, reference, floating, strategy, refs } = useFloating({
    placement: props.placement || "bottom-start",
    strategy: "fixed",
    middleware: [flip(), shift()],
  });

  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    const elem = document.getElementById(props.anchor);
    reference(elem);
    if (elem) {
          let enterTimeout;
    const originalMeCallback = elem.onmouseenter;
    elem.onmouseenter = event => {

      originalMeCallback && originalMeCallback(event);
      enterTimeout = setTimeout(() => {
        setVisible(true);
        setHovered(true);
        if (refs.floating.current) {
          refs.floating.current.onmouseenter = () => {
            clearTimeout(leaveTimeout);
            setHovered(true);
            setVisible(true);
          }
          refs.floating.current.onmouseleave = () => {
            setHovered(false);
            setVisible(false);
          }
        }
      }, 1000);
    }
    let leaveTimeout;
    const originalMlCallback = elem.onmouseleave;

    elem.onmouseleave = event => {
      clearTimeout(enterTimeout);
      originalMlCallback && originalMlCallback(event);
      if (!hovered) leaveTimeout = setTimeout(() => setVisible(false), 1000);
    }

    return () => {
      elem.onmouseenter = originalMeCallback;
      elem.onmouseleave = originalMlCallback;
    }
    }

  }, [])

  return (
    <TooltipElement ref={floating} style={{ top: y, left: x, position: strategy, display: visible ? 'block' : 'none', opacity: visible ? '1' : '0' }}>
      {props.content && typeof props.content === 'string' ? t(props.content) : props.content}
      {props.children && props.children}
    </TooltipElement>
  )
};

export default Tooltip;