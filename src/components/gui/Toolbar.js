import styled from 'styled-components/macro';
import React from "react";

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Item = styled.div`
  flex: 0 ${props => (100 / props.columns)-1}%;
  //max-width: 150px;
  //margin-bottom: ${props => props.theme.spacing[2]};
  margin-bottom: 2%; /* (100-32*3)/2 */
  
  &:not(:last-child) {
     //padding-right: ${props => props.theme.spacing[2]}; 
  }
`;

const Toolbar = props => {
    return (
        <Bar>
            {props.children.map((item, index) => {
                return <Item columns={props.columns || 3} key={index}>{item}</Item>
            })}
        </Bar>
    )
};

export default Toolbar;