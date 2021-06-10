import styled from 'styled-components/macro';
import React from "react";
import { useTranslation } from 'react-i18next';

const Main = styled.label`
  display: ${props => props.inline ? "inline" : "block"};
  /* font-size: 0.9rem; */
  color: ${props => props.disabled ? props.theme.grey_2 : "inherit"};
  cursor: ${props => props.disabled ? 'not-allowed' : "pointer"};
  margin-bottom: ${props => props.noMargin ? 0 : props.theme.spacing[3]};
  // color: ${props => props.required ? "blue" : "inherit"};
  
  &:hover {
    
    &:first-line {
      color: ${props => props.theme.brand_secondary};
      /* text-decoration: ${props => props.disabled ? 'none' : "underline"}; */
    }

    input {
      border-color: ${props => props.theme.grey_2};
      text-decoration: ${props => props.disabled ? 'none' : "underline"};
    }
  }
`;

export const Sub = styled.span`
  display: block;
  font-size: 0.9rem;
  margin: ${props => props.theme.spacing[1]} 0;
  color: ${props => props.theme.brand_secondary};
`;

const Label = props => {
  const { t } = useTranslation();
  return (
    <Main data-tip={t(props.tip)} {...props}>
      <small>{t(props.label)}{props.required && <span aria-hidden={true}>&nbsp;*</span>}</small>
      {props.sublabel &&
        <><br /><Sub className={'sub-label'}>{t(props.sublabel)}</Sub></>
      }
      {props.children}
    </Main>
  );
};

export default Label;
