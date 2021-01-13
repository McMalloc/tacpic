import styled from 'styled-components/macro';
import React from "react";

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