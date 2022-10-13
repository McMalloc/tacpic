import styled from "styled-components/macro";
import { fadeIn, slideFromAbove } from "./Animations";
import { useTranslation } from "react-i18next";
import { Icon } from "./_Icon";
import React, { useRef, useState, useEffect } from "react";
import { getViewport } from "../../utility/viewport";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import Toggle from "./Toggle";
import { useBreakpoint } from "../../contexts/breakpoints";
import { Button } from "./Button";

const Flyout = styled.div`
  background-color: ${(props) => props.theme.background};
  border-radius: ${(props) => props.theme.border_radius};
  box-shadow: ${(props) => props.theme.very_distant_shadow};
  border: 1px solid ${(props) => props.theme.foreground};
  padding: ${(props) => props.theme.large_padding};
  box-sizing: border-box;
  overflow: auto;
  max-width: 500px;

  .flyout-entry {
    min-width: ${(props) =>
    props.flyoutWidth ? props.flyoutWidth + "px" : "auto"};
  }

  position: fixed;
  top: 1.5em;
  left: 0;
  /* right: ${(props) => (props.rightAlign ? 0 : "inherit")}; */
  /* left: ${(props) => (props.rightAlign ? "inherit" : 0)}; */
  z-index: 10000;
  animation: ${fadeIn} 0.1s ease-in, ${slideFromAbove} 0.1s ease-in;
`;

const FlyoutWrapper = (props) => {
  return createPortal(
    <Flyout tabIndex={-1} {...props} ref={props._ref} />,
    document.getElementById("flyout")
  );
};

const FlyoutEntryWrapper = styled.div`
  padding: ${(props) => props.theme.base_padding} ${(props) => props.theme.large_padding};
  cursor: pointer;
  transition: background-color 0.1s, color 0.1s;
  margin-left: -${(props) => props.theme.large_padding};
  margin-right: -${(props) => props.theme.large_padding};
  border-bottom: 1px solid ${(props) => props.theme.foreground};

  .icon {
      width: 2rem;
      display: inline-block;
  }

  &:first-child {
    margin-top: -${(props) => props.theme.large_padding};
  }
  &:last-child {
    margin-bottom: -${(props) => props.theme.large_padding};
    border-bottom: none;
  }

  label {
    /* margin-left: 1em; */
  }

  .sub-label {
    margin-top: 0.5rem;
  }

  &:hover {
    label {
      text-decoration: underline;
    }
  }
`;

export const FlyoutEntry = (props) => {
  const { t } = useTranslation();
  return (
    <FlyoutEntryWrapper
      className={"flyout-entry"}
      tabIndex={0}
      role={"button"}
      onClick={props.onClick}
    >
      {!!props.link ?
        <a data-pom={props.pom} download={props.download ? props.download : false} className={'no-styled-link'} target={'_blank'} href={props.link}><Icon icon={props.icon} />
          <label>{t(props.label)}</label>
          {props.sublabel && (
            <>
              <br />
              <span className={'sub-label'}>{t(props.sublabel)}</span>
            </>
          )}</a>
        :
        <>
          <Icon icon={props.icon} />
          <label data-pom={props.pom}>{t(props.label)}</label>
          {props.sublabel && (
            <>
              <br />
              <span className={'sub-label'}>{t(props.sublabel)}</span>
            </>
          )}
        </>
      }
    </FlyoutEntryWrapper>
  );
};

/* TODO:
 * toggle() wird zweimal aufgerufen bei einem Klick auf den Button, führt zu Fehler bei focus()
 * Nach Öffnen des Flyouts sollte das erste Element mit tabindex fokussiert werden, nicht das Menü selbst
 * das Menü auf Touchgeräten schließen, wenn außerhalb berührt wird (vgl. https://stackoverflow.com/questions/13492881/why-is-blur-event-not-fired-in-ios-safari-mobile-iphone-ipad)
 * WIA-ARIA
 */
const FlyoutButton = (props) => {
  const [out, setOut] = useState(false);
  let eventTimer = -1;

  const buttonRef = useRef();
  const flyoutRef = useRef();
  const { sm } = useBreakpoint();

  useEffect(() => {
    if (!out) return;
    if (buttonRef.current === null) return;
    if (flyoutRef.current === null) return;
    const { vw, vh } = getViewport();
    const buttonBBox = buttonRef.current.getBoundingClientRect();
    flyoutRef.current.style.left = sm ? buttonBBox.left + "px" : 0;
    flyoutRef.current.style.minWidth = sm ? Math.max(buttonBBox.width, 200) + "px" : "100%";
    flyoutRef.current.style.top = buttonBBox.top + buttonBBox.height + "px";
    const flyoutBBox = flyoutRef.current.getBoundingClientRect();
    if (vh < buttonBBox.top + flyoutBBox.height + buttonBBox.height) {
      if (vh < flyoutBBox.height) {
        flyoutRef.current.style.top = 0;
        flyoutRef.current.style.bottom = 0;
      } else {
        flyoutRef.current.style.top = `${vh - flyoutBBox.height}px`;
      }
    }
    if (vw < flyoutBBox.left + flyoutBBox.width) {
      if (vw < flyoutBBox.width) {
        flyoutRef.current.style.left = 0;
        flyoutRef.current.style.right = 0;
      } else {
        flyoutRef.current.style.left = `${vw - flyoutBBox.width}px`;
      }

    }
  }, [out]);

  const toggle = () => {
    if (out) {
      out ? setOut(false) : setOut(true);
    } else {
      // TODO else war vorher weg, könnte jetzt einen Fehler beherbergen
      out ? setOut(false) : setOut(true);
      // the timer will fire after the current render cycle, so the ref is actually in the dom after the flag went true
      setTimeout(
        () => flyoutRef.current !== null && flyoutRef.current.focus(),
        0
      );
    }
  };

  const onBlurHandler = () =>
    (eventTimer = setTimeout(() => setOut(false), 10));
  const onFocusHandler = () => {
    if (eventTimer > 0) {
      clearTimeout(eventTimer);
      eventTimer = -1;
    }
  };

  return (
    // <span className={props.className} style={{position: "relative"}}>
    <>
      <Toggle
        isDropdown={true}
        toggled={out}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        {...props}
        ref={buttonRef}
        onClick={toggle}
      />
      {out && (
        <FlyoutWrapper
          flyoutWidth={props.flyoutWidth}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          rightAlign={props.rightAlign || false}
          _ref={flyoutRef}
        >

          {props.children}
          {!!props.closeButton && <Button onClick={toggle}
            icon={'times'}
            style={{ position: 'absolute', top: 6, right: 6 }} />}
        </FlyoutWrapper>
      )}
    </>
  );
};

FlyoutButton.propTypes = {
  label: PropTypes.string,
  noPad: PropTypes.bool,
  rightAlign: PropTypes.bool,
  flyoutWidth: PropTypes.number,
  contrasted: PropTypes.bool,
  closeButton: PropTypes.bool,
};

export { FlyoutButton };
