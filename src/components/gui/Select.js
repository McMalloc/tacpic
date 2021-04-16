import styled from 'styled-components/macro';
import React from "react";
import Label from "./_Label";
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
    position: relative;

    &:hover:after {
    border-color: ${(props) => props.theme.brand_secondary_lighter};
    
  }

    &:after {
        content: '\f0d7';
        font-weight: 700;
        color: black;
        font-family: 'Font Awesome 5 Free';
        pointer-events: none;
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        width: 1rem;
        padding: 6px 4px;
        text-align: center;
        background-color: ${props => props.theme.background};
        border-radius: ${props => props.theme.border_radius};
        border: ${props => props.theme.elementBorder};
  }
`;

const StyledSelect = styled.select`
    display: block;
    width: 100%;

    font-size: 1em;
  font-weight: 700;
  margin: 0;
  color: ${props => props.disabled ? props.theme.middark : props.theme.brand_secondary};
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
 
  display: ${props => props.inline ? "inline" : "block"};
  width: ${props => props.inline ? "inherit" : "100%"};
  box-sizing: border-box;
  border: ${props => props.theme.elementBorder};
  border-radius: ${props => props.theme.border_radius};
  background-color: ${props => props.disabled ? "transparent" : props.theme.background};
  padding: 4px ${props => props.theme.spacing[1]};
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  transition: outline 0.1s;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: none;

  &:hover:not(:disabled) {
    background-color: ${(props) =>
        props.primary ? props.theme.brand_secondary_lighter : props.theme.light};
    box-shadow: ${(props) => props.theme.middle_shadow};
    border-color: ${(props) => props.theme.brand_secondary_lighter};
    text-decoration: underline;
  }

  &.attached {
    border-radius: ${props => props.theme.border_radius} 0 0 ${props => props.theme.border_radius};
  }
  
  &.dirty:invalid {
    border-radius: ${props => props.theme.border_radius} ${props => props.theme.border_radius} 0 0;
    //box-shadow: 0 0 5px 2px red;
  }
  
  &::placeholder {
    font-style: italic;
  }
  
  &:focus, &:active {
     outline: 4px solid rgba(38, 132, 255, 0.7);
  }
`;

const Select = props => {
    const { t } = useTranslation();

    return (
        <Label
            tip={props.tip}
            sublabel={props.sublabel}
            required={props.required}
            style={props.style}
            label={props.label}
            noMargin={props.noMargin}
            disabled={props.disabled}
            id={props.label ? "label-for-" + props.name : ""}
            inline={props.inline}
        ><Wrapper>
                <StyledSelect {...props} onChange={event => props.onChange({value: event.target.value})}>
                    {props.options.map(option =>
                        <option title={t(option.sublabel)} value={option.value}>
                            {t(option.label)}
                        </option>
                    )}
                </StyledSelect></Wrapper>
        </Label>


    )

};

export default Select