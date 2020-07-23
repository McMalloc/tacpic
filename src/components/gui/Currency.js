import React from "react";
import styled from 'styled-components/macro';

const Wrapper = styled.span`
  font-weight: ${props=> props.normal ? 'normal' : 'bold'};
  color: ${props=>props.theme.brand_secondary};
`;

const Currency = props => {
    // get current regional currency from hook/state
    return (
        <Wrapper normal={props.normal}>
            {(props.amount / 100).toFixed(2).replace('.', ',')}&thinsp;€
        </Wrapper>
    )
};


export {Currency}