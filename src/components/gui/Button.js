import styled, { useTheme } from "styled-components/macro";
import React, { Component, useRef, useState } from "react";
import { fadeIn, slideFromAbove } from "./Animations";
import { useTranslation } from "react-i18next";
import { Icon } from "./_Icon";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import More from "./More";
import Toggle from "./Toggle";
import { SM_SCREEN } from "../../config/constants";
import { useBreakpoint } from "../../contexts/breakpoints";

const Label = styled.span`
  padding-left: ${(props) =>
    props.hasIcon
      ? props.large
        ? props.theme.spacing[3]
        : props.theme.spacing[2]
      : 0};
  display: inline-block;
  white-space: nowrap;
`;

const ButtonBase = styled.button`
  background-color: ${(props) =>
    props.primary ? props.theme.brand_secondary : "white"};
  color: ${(props) => (props.primary ? props.theme.background : "inherit")};
  border: 1px solid ${(props) => props.theme.brand_secondary_lighter};
  padding: ${(props) =>
    props.small
      ? 0
      : props.large
      ? "8px 18px"
      : `${props.theme.spacing[1]} ${props.theme.spacing[2]}`};
  text-transform: ${(props) => (props.small ? "uppercase" : "none")};
  border-radius: ${(props) => props.theme.border_radius};
  cursor: pointer;
  float: ${(props) => (props.rightAction ? "right" : "none")};
  margin: 0;
  position: relative;
  font-size: ${(props) => (props.small ? "0.8rem" : "1rem")};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  transition: box-shadow 0.15s cubic-bezier(0.19, 1, 0.22, 1),
    background-color 0.15s;
  display: inline-flex;
  justify-content: ${(props) => (props.leftAlign ? "left" : "center")};

  &.right-attached {
    border-radius: 0 ${(props) => props.theme.border_radius}
      ${(props) => props.theme.border_radius} 0;
  }

  &:disabled {
    color: ${(props) => props.theme.grey_0};
    text-shadow: 1px 1px 0 white;
    box-shadow: 1px 1px 0 white inset;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVQYV2M8derUf21tbQYYuHr1KgPj169f/yMLgNhwQZAKEADpAgsiC4BVgsyEqYAZAwAYXB5aB8AaFAAAAABJRU5ErkJggg==)
      repeat;
    opacity: 0.7;
    border-color: ${(props) => props.theme.grey_3};
    cursor: not-allowed;

    &:hover {
      box-shadow: none;
    }
  }

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.primary ? props.theme.brand_secondary_lighter : props.theme.light};
    box-shadow: ${(props) => props.theme.middle_shadow};
    border-color: ${(props) => props.theme.brand_secondary_lighter};
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
  const label = props.label || props.children;
  const breakpoints = useBreakpoint();

  const collapsedLabel = props.collapsable && !breakpoints[props.collapsable];

  return (
    <ButtonBase type={props.type || "button"} ref={ref} {...props}>
      {props.icon && <Icon icon={props.icon} primary={props.primary} />}
      {label && (
        <Label hasIcon={!!props.icon && !collapsedLabel}>
          {!collapsedLabel && t(label)}
          {props.isDropdown && (
            <>
              &nbsp;
              <Icon icon={"caret-down"} />
            </>
          )}
        </Label>
      )}
    </ButtonBase>
  );
});

Button.propTypes = {
  label: PropTypes.string.isRequired,
  collapsable: PropTypes.oneOf(["sm", "md", "lg", "xl"]), // label can collapse under provided breakpoint
  isDropdown: PropTypes.bool, // if caret will be displayed
  icon: PropTypes.string, // fontawesome icon id
  primary: PropTypes.bool, // primary colour scheme
};

const Caret = styled.span`
  margin-left: 0.5em;
  display: inline-block;
  transition: transform 0.1s;
  position: relative;
  transform: translate(0, ${(props) => (props.down ? "1em" : 0)})
    scale(${(props) => (props.down ? 2 : 1)});
  z-index: ${(props) => (props.down ? 9999 : "inherit")};
`;

export { Button, ButtonBase };
