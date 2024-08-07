import React, {useEffect} from 'react';
import styled, {useTheme} from "styled-components/macro";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Tile from "./_Tile";
import {Icon} from "./_Icon";

const Title = styled.div`
  padding: ${props => props.theme.large_padding};
  font-weight: bold;
  display: flex;
  justify-items: stretch;
  
  span:nth-child(1) {
    flex: 1 0 auto;
  }  
  
  span:nth-child(2) {
    flex: 0 1 auto;
  }
`;

const Description = styled.div`
 padding: ${props => props.theme.large_padding};
 display: flex;
 flex: 1 1 100%;
`;

const Card = props => {
    const t = useTranslation().t;
    return (
        <NavLink className={'no-styled-link'} to={props.link}>
            <Tile>
                <Title>
                    <span className={"hover-sensitive"}>{t(props.title)}</span>
                    <Icon icon={props.icon}/>
                </Title>
                <Description>{t(props.description)}</Description>
            </Tile>
        </NavLink>
    )
};

export default Card;