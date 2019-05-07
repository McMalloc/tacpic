import styled from 'styled-components';
import React from "react";
import {useTranslation} from 'react-i18next';
import {Icon} from "./_Icon";

const Main = styled.label`
  font-size: 0.9em;
  display: ${props => props.inline ? "inline" : "block"};
  color: ${props => props.disabled ? props.theme.middark : "inherit"};
  margin-bottom: ${props => props.theme.spacing[3]};
  
  &:hover {
    text-decoration: underline;
    
    input {
      text-decoration: none;
    }
  }
`;

const Sub = styled.span`
  font-size: 0.8em;
  margin: ${props => props.theme.spacing[1]} 0;
  color: ${props => props.theme.brand_secondary};
  display: block;
  line-height: 1.1em;
`;

const Label = props => {
    const { t } = useTranslation();
    return (
        <Main {...props}>{t(props.label)}
            {props.sublabel &&
            <><br/><Sub>{t(props.sublabel)}</Sub></>
            }
            {props.children}
        </Main>
    );
};

export default Label;
