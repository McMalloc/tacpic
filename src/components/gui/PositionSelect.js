import React from 'react';
import styled from 'styled-components/macro';
import patternTemplates from "../editor/widgets/ReactSVG/Patterns.js";
import {useTranslation} from "react-i18next";
import {Icon} from "./_Icon";

// TODO: Minimieren-Button
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  line-height: 0;
  width: 6em;
  transition: border-color 0.2s, background-color 0.1s;
  background-color: ${props => props.active ? props.theme.background : props.theme.accent_1_light};
  padding: 2px;
  border-radius: ${props => props.theme.border_radius};
  
  &:hover {
     //border-color: ${props => props.theme.accent_1};
     background-color: ${props => props.theme.background};
  }
`;

const Tile = styled.div`
  min-width: 1.5em;
  flex: 1 1 auto;
  height: 1.5em;
  text-align: center;
  margin: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${props => props.theme.background};
  border: 1px solid black;
`;

const arrows = {
    lefttop:        <Icon icon={"arrow-up"} rotation={315}/>,
    centertop:      <Icon icon={"arrow-up"} />,
    righttop:       <Icon icon={"arrow-up"} rotation={45}/>,
    leftcenter:     <Icon icon={"arrow-left"} />,
    centercenter:   <Icon icon={"compress"} />,
    rightcenter:    <Icon icon={"arrow-right"} />,
    leftbottom:     <Icon icon={"arrow-up"} rotation={225}/>,
    centerbottom:   <Icon icon={"arrow-down"} />,
    rightbottom:    <Icon icon={"arrow-up"} rotation={135}/>,
};

const PositionSelect = props => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            {["top", "center", "bottom"].map(posY => {
                return ["left", "center", "right" ].map(posX => {
                    const key = posX + posY;
                    return (
                        <Tile
                            key={key}
                            active={props.selected === key}
                            onClick={() => props.onChange(posX, posY)}>
                            {arrows[key]}
                    </Tile>)
                })
            })}
        </Wrapper>
    )
};

export default PositionSelect;