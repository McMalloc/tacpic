import styled from 'styled-components/macro';
import React from "react";
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 0;
`;

const StepWrapper = styled.div`
  text-align: center;
  padding: 0 ${props=>props.theme.base_padding};
  position: relative;
  flex: 1 1 auto; 
  
  &:before {
    position: absolute; 
    border: 1px solid #999;
    height: 0; 
    display: block; 
    z-index: -1;
    content: ''; 
    left: 0;
    right: 0;
    top: 17px;
  }
  
    &:first-child:before { left: 50%; }
    &:last-child:before { right: 50%; }
  
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
  cursor: ${props=>props.navigationable ? 'pointer' : 'inherit'};
`;

/**
 * Component for indicating steps in a process.
 */
const StepIndicator = ({steps, current, navigationable}) => {
    const { t } = useTranslation();

    return (
        <Wrapper>{steps.map((step, index) => {
            return (
                <StepWrapper key={index} onClick={() => navigationable && navigationable(index)} active={current === index}>
                    <NumberCircle navigationable={!!navigationable} active={current === index}>{index + 1}</NumberCircle>
                    <br /><label>{t(step)}</label>
                </StepWrapper>
            )
        })}</Wrapper>
    )

};

StepIndicator.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    current: PropTypes.number.isRequired
};

export default StepIndicator