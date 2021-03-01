import styled from 'styled-components/macro';
import React from "react";
import { useTranslation } from 'react-i18next';

const Label = styled.label`
  //font-size: 0.9em;
  position: relative;
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
  margin: 0;
  
  /* &:checked + label {
    text-decoration: underline;
  }  */

  &:checked + label:before {
    font-weight: bold;
    text-decoration: none!important;
    content: "\f192";
  } 

`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${props=>props.padded ? props.theme.large_padding : 0};
  
  &.disabled-option {
    color: ${props => props.theme.grey_3};
    
    label {
      cursor: inherit;
      &:hover {
        text-decoration: none;
      }
    }
  }
  
  &:last-child {
    margin-bottom: inherit;
  }  
  //height: 26px;
`;


// TODO: wie checkbox neu machen
const Radio = props => {
  const {t} = useTranslation();
    return (
        <div role={'group'} aria-labelledby={props.name + "_head"}>
            <Grouphead id={props.name + "_head"}>
              {t(...props.legend)}
            </Grouphead>
            {props.options && props.options.map((option, index) => {
                return (
                    <Wrapper className={option.disabled ? 'disabled-option' : ''} data-active={option.value === props.value} padded={props.padded} key={index}>
                        <Input
                            onChange={event => !option.disabled && props.onChange(event.target.value)}
                            name={props.name}
                            disabled={option.disabled}
                            id={props.name + "-" + option.value}
                            checked={option.value === props.value}
                            value={option.value}
                            type={"radio"}/>
                            <Label active={option.value === props.value}
                                   htmlFor={props.name + "-" + option.value}>
                                <span className={"label"}>{option.component ? option.component : option.label}</span>
                            </Label>
                    </Wrapper>
                )
            })}
        </div>
    )
}

export {Radio}