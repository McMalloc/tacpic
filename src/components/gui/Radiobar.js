import styled from "styled-components/macro";

export const Radiobar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  //z-index: 20;
  padding: 6px ${props => props.theme.large_padding};
`;

export const RadiobarSegment = styled.div`
  display: flex;
  
  button {
    
    &:not(:first-child) {
      border-left: 0;
    }
        
    &:first-child {
      border-radius: ${props => props.theme.border_radius} 0 0 ${props => props.theme.border_radius};
    }
    
    &:last-child {
      border-radius: 0 ${props => props.theme.border_radius} ${props => props.theme.border_radius} 0;
    }
    
    border-radius: 0;
  }
`;