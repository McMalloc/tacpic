import styled from 'styled-components/macro';
import React from "react";
import {useTranslation} from "react-i18next";
import {Sub} from "./_Label";

const CheckboxLabel = styled.label`
  position: relative;
  align-self: center;
  margin-bottom: 0.5em;
  padding-left: 1.4em;
  transition: font-weight 0.2s, color 0.2s;
  cursor: pointer;
  
  &:last-child {
  margin-bottom: inherit;
  }
  
  &:before {
      position: absolute;
      /* margin-right: 0.5em; */
      left: 0;
      align-self: center;
      text-decoration: none;
      content: "\f0c8";
      font-family: 'Font Awesome 5 Free';
  }
  
  &:hover .label {
    text-decoration: ${props => props.disabled ? "none" : "underline"};
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  margin: 0;

  &:checked + label:before {
      font-weight: bold;
      text-decoration: none!important;
      content: "\f14a";
  }  

  &:disabled + label {
      cursor: not-allowed;
      text-shadow: 1px 1px 0 white;
      color: ${props => props.theme.grey_2};
  }

  &:focus + label {
    outline: 4px solid rgba(38, 132, 255, 0.7);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${props => props.theme.spacing[1]};
`;

const Checkbox = props => {
    const { t } = useTranslation();
        return (
            <Wrapper id={props.name + "-cb-wrapper"}>
                 <Input
                     onChange={props.onChange}
                     name={props.name}
                     disabled={props.disabled}
                     aria-disabled={props.disabled}
                     id={props.name + "-cb"}
                     checked={props.value}
                     value={props.value}
                     type={"checkbox"} />
                 <CheckboxLabel disabled={props.disabled} checked={props.checked} htmlFor={props.name + "-cb"}>
                     <span className={'label'}>{t(props.label)}</span>
                     {props.sublabel &&
                     <><br/><Sub>{t(props.sublabel)}</Sub></>
                     }
                 </CheckboxLabel>
            </Wrapper>
        )
};

export {Checkbox}