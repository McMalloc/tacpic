import styled from 'styled-components/macro';
import React from "react";
import { useTranslation } from "react-i18next";
import { COLOURS } from '../../config/constants';

const Wrapper = styled.div`
  position: relative;

  div {
      background-color: ${props => props.code};
      height: 2em;
      width: 2em;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid ${props => props.active ? 'transparent' : props.theme.grey_3};
      position: relative;
      border-radius: ${props => props.theme.border_radius};
      
      &:after {
        position: absolute;
        left: 40%;
        right: 40%;
        content: "";
        bottom: 40%;  
        border-radius: ${props => props.theme.border_radius};
        top: 40%;
        background-color: rgba(0,0,0,${props => props.active && props.code !== COLOURS.none ? 0.7 : 0});
      }
    }

    &.empty:after {
        width: ${2*1.41}em;
        height: ${2*1.41}em;
        top: 0; left: 0;
        border-top: 1px solid #333333;
        content: "";
        transform-origin: top left;
        transform:
            translateY(${props => props.theme.spacing[1]})
            translateX(${props => props.theme.spacing[1]})
            rotate(45deg); 
        position: absolute;
    }
  
  background-color: ${props => props.active ? props.code : "transparent"};
  transition: 0.1s;
  cursor: pointer;
  border: 1px solid ${props => props.active ? props.theme.grey_1 : 'transparent'};
  border-radius: ${props => props.theme.border_radius};
  padding: ${props => props.theme.spacing[1]};
  
  &:hover {
    //background-color: rgba(0,0,0,0.4);
    border: 1px solid ${props => props.theme.middark};;
  }
`;

// mit Farbcode und Bezeichnung als title
const Swatch = props => {
  const { t } = useTranslation();
  const label = t("colour:" + props.code);

  return (
    <Wrapper role={"button"}
      active={props.active}
      title={label + " (" + props.code + ")"}
      onClick={() => props.onClick(props.code)}
      code={props.code}
      className={props.code === COLOURS.none ? 'empty' : ''}
      aria-label={label}>
      <div />
      {/* <div>{ props.code === COLOURS.none && t("none") }</div> */}
    </Wrapper>
  )
};

export default Swatch;