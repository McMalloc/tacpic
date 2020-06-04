import React, {Fragment} from 'react';
import styled from 'styled-components/macro';
import {useTranslation} from "react-i18next";

const Label = styled.span`
  position: relative;
  display: inline-block;
  font-size: 0.8em;
  letter-spacing: 0.2px;
  
  &:after, &:before {
    content: "";
    position: absolute;
    top: 50%;
    width: 9999px;
    height: 1px;
    background: ${({theme}) => theme.midlight};
  }
  
  &:after {
    right: 100%;
    margin-right: ${({theme}) => theme.spacing[3]};
  } 
   
  &:before {
    left: 100%;
    margin-left: ${({theme}) => theme.spacing[3]};
  }
`;



const Line = styled.div`
  display: block;
  text-align: center;
  overflow: hidden;
  white-space: nowrap; 
`;



const Divider = props => {
    const { t } = useTranslation();
    //TODO vertical divider with flexbox
    return (
        <Fragment>
            {props.vertical ?
                <Line>
                    <Label>{t(props.label)}</Label>
                </Line>
            :
                <Line>
                    <Label>{t(props.label)}</Label>
                </Line>
            }
        </Fragment>
    )
};

export default Divider;