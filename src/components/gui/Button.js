import styled from "styled-components/macro";
import React from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "./_Icon";
import PropTypes from "prop-types";
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
    props.primary ? props.theme.brand_secondary : props.dangerous ? props.theme.danger : "white"};
  color: ${props => (props.primary || props.dangerous ? props.theme.background : props.theme.foreground)};
  border: ${props => props.dangerous ? '2px solid ' + props.theme.danger_dark : props.theme.elementBorder};
  padding: ${props =>
    props.small
      ? '2px 4px'
      : props.large
      ? "8px 18px"
      : `${props.theme.spacing[1]} ${props.theme.spacing[2]}`};
  /* text-transform: ${(props) => (props.small ? "uppercase" : "none")}; */
  border-radius: ${(props) => props.theme.border_radius};
  cursor: pointer;
  float: ${(props) => (props.rightAction ? "right" : "none")};
  margin: 0;
  position: relative;
  font-size: ${(props) => (props.small ? "0.9rem" : "1rem")};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  transition: all 0.15s cubic-bezier(0.19, 1, 0.22, 1);
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
    background-color: ${props =>
      props.primary ? props.theme.brand_secondary_lighter : props.theme.light};
    box-shadow: ${props => props.theme.middle_shadow};
    border-color: ${props => props.dangerous ? props.theme.warning : props.theme.brand_secondary_lighter};
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
    // <ButtonBase {...props} aria-label={t(label)} type={props.type || "button"} ref={ref} title={t(props.title || t(label))} >
    <ButtonBase {...props} aria-label={t(label)} type={props.type || "button"} ref={ref}>
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
  label: PropTypes.string,
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
