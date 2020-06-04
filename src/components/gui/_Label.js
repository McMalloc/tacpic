import styled, {useTheme} from 'styled-components/macro';
import React, {useContext} from "react";
import {useTranslation} from 'react-i18next';
import {Icon} from "./_Icon";

const Main = styled.label`
  //font-size: 0.9em;
  display: ${props => props.inline ? "inline" : "block"};
  color: ${props => props.disabled ? props.theme.middark : "inherit"};
  margin-bottom: ${props => props.noMargin ? 0 : props.theme.spacing[3]};
  
  &:hover:first-line {
    //border-color: ${props => props.theme.brand_secondary};
    text-decoration: underline;
  }
`;

export const Sub = styled.span`
  font-size: 0.9em;
  margin: ${props => props.theme.spacing[1]} 0;
  color: ${props => props.theme.brand_secondary};
  display: block;
  font-style: italic;
  line-height: 1.1em;
`;

const Label = props => {
    const theme = useTheme();
    const { t } = useTranslation();
    return (
        <Main theme={theme} data-tip={t(props.tip)} {...props}>{t(props.label)}
            {props.sublabel &&
            <><br/><Sub>{t(props.sublabel)}</Sub></>
            }
            {props.children}
        </Main>
    );
};

export default Label;
