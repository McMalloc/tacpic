import styled from 'styled-components';
import React, {Component, Fragment} from "react";
import {useTranslation} from "react-i18next";

const Label = styled.label`
  //font-size: 0.9em;
  //display: flex;
  margin-bottom: 0.5em;
  padding-left: 1.4em;
  transition: font-weight 0.1s, color 0.1s;
  position: relative;
  align-items: center;
  color: ${props => props.disabled ? props.theme.grey_4 : "inherit"};
  
  &:last-child {
  margin-bottom: inherit;
  }
  
  &:before {
      left: 0.1em;
      top: 0.1em;
      width: 1em;
      height: 1em;
      position: absolute;
      margin-right: 0.5em;
      align-self: center;
      box-sizing: border-box;
      content: "";
      border-radius: ${props => props.theme.border_radius};
      border: 1px solid ${props => props.disabled ? props.theme.grey_4 : props.checked ? props.theme.brand_secondary : props.theme.midlight};
      background-color: ${props => props.disabled ? "transparent" : props.checked ? props.theme.brand_secondary : "white"};
      transition: background-color 0.1s;
  }
  
  &:after {
    position: absolute;
    transition: opacity 0.1s;
    display: inline-block;
    color: white;
    height: 0;
    font-size: 16px;
    left: 0.3em;
    top: 0;
  }
  
  &:hover {
    text-decoration: ${props => props.disabled ? "none" : "underline"};
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  margin: 0;

  &:checked + label {
    font-weight: 700;
    color: ${props => props.theme.brand_secondary};
  }  

  &:checked + label:after {
    content: "✔";
  }  

  &:focus + label {
    box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing[1]};
  //height: 26px;
`;

const Checkbox = props => {
    const { t } = useTranslation();
        return (
            <Wrapper>
                 <Input
                     onChange={props.onChange}
                     name={props.name}
                     disabled={props.disabled}
                     aria-disabled={props.disabled}
                     id={props.name + "-cb"}
                     checked={props.checked}
                     type={"checkbox"} />
                 <Label disabled={props.disabled} checked={props.checked} htmlFor={props.name + "-cb"}>
                     {t(props.label)}
                 </Label>
            </Wrapper>
        )
};

export {Checkbox}