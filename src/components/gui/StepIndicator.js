import styled from 'styled-components/macro';
import React from "react";
import AtlSelect from 'react-select'
import AtlCrSelect from 'react-select/creatable'
import Label from "./_Label";
import {useTranslation} from 'react-i18next';
import {standard} from "../../styles/themes";
import {find} from "lodash";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 0;
  position: relative;
  
  &:before {
    position: absolute; 
    border: 1px solid #999; 
    height: 0; 
    display: block; 
    content: ''; 
    left: 30px;
    right: 30px;
    top: 17px;
    //z-index: 1;  
    //margin-left: -1px;
  }
`;

const StepWrapper = styled.div`
  text-align: center;
  z-index: 1;
  
  label{
    font-weight: ${props=>props.active ? 'bold' : 'normal'};
  }
`;

const NumberCircle = styled.span`
  width: 30px;
  height: 30px;
  line-height: 30px;
  border: 2px solid ${props=>props.theme.brand_secondary_lighter};
  display: inline-block;
  border-radius: 100%;
  background-color: ${props=>props.active ? props.theme.brand_secondary_lighter : 'white'};
  font-weight: ${props=>props.active ? 'bold' : 'normal'};
  color: ${props=>props.active ? 'white' : 'inherit'};
`;

const StepIndicator = ({steps, current}) => {
    const { t } = useTranslation();

    return (
        <Wrapper>{steps.map((step, index) => {
            return (
                <StepWrapper active={current === index}>
                    <NumberCircle active={current === index}>{index + 1}</NumberCircle>
                    <br /><label>{t(step)}</label>
                </StepWrapper>
            )
        })}</Wrapper>
    )

};

export default StepIndicator