import styled from 'styled-components/macro';
import React, {Component, Fragment} from "react";

const Label = styled.label`
  //font-size: 0.9em;
  position: relative;
  display: flex;
  align-self: center;
  margin-bottom: 0.5em;
  transition: font-weight 0.2s, color 0.2s;
  cursor: pointer;
  
  &:checked {
    text-decoration: underline;
  }
  
  &:last-child {
    margin-bottom: inherit;
  }
  
  &:before {
      position: relative;
      margin-right: 0.5em;
      //padding: 0 0.5em;
      align-self: center;
      font-family: 'Font Awesome 5 Free';
      text-decoration: none!important;
      font-weight: 400;
      content: "\f111";
      opacity: ${props => props.active ? 0 : 1};
      transition: background-color 0.1s;
  }  
  
  &:after {
      position: absolute;
      margin-right: 0.5em;
      left: 0;
      align-self: center;
      text-decoration: none!important;
      content: "\f192";
      font-family: 'Font Awesome 5 Free';
      opacity: 0;
      transition: opacity 0.1s;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const BigLabel = styled(Label)`

`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  margin: 0;
  
  &:checked+label {
    font-weight: bold;
    // color: ${props => props.theme.accent_1};
  } 
  
  &:checked + label:after {
    opacity: 1;
  }  
  
  &:focus + label {
    box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
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
    return (
        <>
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
                        {option.component ?
                            <BigLabel active={option.value === props.value} htmlFor={props.name + "-" + option.value}>
                                {option.component}
                            </BigLabel>
                            :
                            <Label active={option.value === props.value}
                                   htmlFor={props.name + "-" + option.value}>
                                {option.label}
                            </Label>
                        }
                    </Wrapper>
                )
            })}
        </>
    )
}

export {Radio}