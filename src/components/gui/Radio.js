import styled from 'styled-components/macro';
import React from "react";
import { useTranslation } from 'react-i18next';
import { KEYCODES } from '../../config/constants';

const Label = styled.label`
  //font-size: 0.9em;
  position: relative;
  white-space: break-spaces;
  display: flex;
  align-self: center;
  margin-bottom: 0.5em;
  transition: font-weight 0.2s, color 0.2s;
  cursor: pointer;
  
  &:last-child {
    margin-bottom: inherit;
  }
  
  &:before {
      position: relative;
      margin-right: 0.5em;
      left: 0;
      align-self: center;
      text-decoration: none!important;
      content: "\f111";
      font-family: 'Font Awesome 5 Free';
  }  
  
  &:hover .label {
    text-decoration: underline;
  }
`;

const Grouphead = styled.div`
  padding-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  
  &:disabled.disabled-option + label {
      color: ${props => props.theme.grey_3};
      cursor: not-allowed;
  }

  &:checked + label:before {
    font-weight: bold;
    text-decoration: none!important;
    content: "\f192";
  } 

`;


// TODO: wie checkbox neu machen
const Radio = props => {
  const { t } = useTranslation();

  return (
    <div role={'radiogroup'} aria-labelledby={props.name + "_head"}>
      <Grouphead id={props.name + "_head"}>
        {Array.isArray(props.legend) ? t(...props.legend) : t(props.legend)}
      </Grouphead>
      {props.options && props.options.map((option, index) => {

        const label = Array.isArray(option.label) ? t(...option.label) : t(option.label);
        return (
          <React.Fragment key={index}>
            <Input
              onChange={event => !option.disabled && props.onChange(event.target.value)}
              name={props.name}
              className={option.disabled ? 'disabled-option' : ''}
              data-active={option.value === props.value}
              checked={option.value === props.value}
              id={props.name + "-" + option.value}
              disabled={option.disabled}
              tabIndex={-1}
              aria-role={'radio'}
              aria-label={label}
              aria-checked={option.value === props.value}
              value={option.value}
              type={"radio"} />

            <Label tabIndex={0} onKeyDown={event => {
              if (event.keyCode === KEYCODES.SPACE) {
                event.preventDefault();
                props.onChange(option.value);
              }
            }} aria-hidden={true} active={option.value === props.value}
              htmlFor={props.name + "-" + option.value}>
              {Array.isArray(option.label) ? t(...option.label) : t(option.label)}
            </Label>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { Radio }