import styled from 'styled-components/macro';
import React from "react";
import {MD_SCREEN} from "../../config/constants";

const ElementGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  
  &>* {
    width: 70%;
    margin-top: 0.5rem;
  }
  
  ${MD_SCREEN} {
    &>* {
      width: 100%;
      margin-top: 0;
    }
    display: grid;
    grid-template-columns: ${props => ' 1fr'.repeat(props.columns || 2)};
    column-gap: 0.5rem;
    row-gap: 0.5rem;
  }
`;

export default ElementGrid;