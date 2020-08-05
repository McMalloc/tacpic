import styled, {useTheme} from 'styled-components/macro';
import React, {Component} from "react";
import {fadeIn, slideFromAbove} from "./Animations";
import {useTranslation} from 'react-i18next';

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    
    button:not(:last-child) {
      margin-right: ${props=>props.theme.large_padding};
    }
`;

const ButtonBar = props => {
    return <Wrapper>
        {props.children}
    </Wrapper>
}

export default ButtonBar;