import styled from 'styled-components';
import React from "react";

const Bar = styled.div`
  display: flex;
  //align-content: space-between;
  flex-wrap: wrap;
`;

const Item = styled.div`
  flex: 1 0 100px;
  max-width: 150px;
  margin-bottom: ${props => props.theme.spacing[2]};
  
  &:not(:last-child) {
     padding-right: ${props => props.theme.spacing[2]}; 
  }
`;

const Toolbar = props => {
    return (
        <Bar>
            {props.children.map((item, index) => {
                return <Item key={index}>{item}</Item>
            })}
        </Bar>
    )
};

export default Toolbar;