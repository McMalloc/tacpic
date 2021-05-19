import styled from 'styled-components/macro';
import React from "react";

const ElementGrid = styled.div`
    display: grid;  
    grid-template-columns: ${props => ' 1fr'.repeat(props.columns || 2)};
    column-gap: 0.5rem;
row-gap: 0.5rem;
`;

export default ElementGrid;