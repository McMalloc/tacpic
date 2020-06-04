import styled from 'styled-components/macro';
import React from "react";
import {useTranslation} from "react-i18next";

const Wrapper = styled.div`
  div {
      background-color: ${props => props.code};
      height: 2em;
      width: 2em;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-radius: 3px;
      
      &:after {
        position: absolute;
        left: 40%;
        right: 40%;
        content: "";
        bottom: 40%;  
        border-radius: ${props => props.theme.border_radius};
        top: 40%;
        background-color: rgba(0,0,0,${props => props.active ? 0.7 : 0});
      }
      
      ${props => props.code === null &&
        `
        border: 1px solid lightgrey;
        `
    }
  }
  
  background-color: ${props => props.active ? props.code : "transparent"};
  transition: 0.1s;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: ${props => props.theme.border_radius};
  
  padding: ${props => props.theme.spacing[1]};
  
  &:hover {
    //background-color: rgba(0,0,0,0.4);
    border: 2px solid ${props => props.theme.middark};;
  }
`;

// mit Farbcode und Bezeichnung als title
const Swatch = props => {
    const {t} = useTranslation();
    const label = t("colour:" + props.code);

    return (
        <Wrapper role={"button"}
                 active={props.active}
                 title={label + " (" + props.code + ")"}
                 onClick={() => props.onClick(props.code)}
                 code={props.code}
                 aria-label={label}>
            <div />
        </Wrapper>
    )
};

export default Swatch;