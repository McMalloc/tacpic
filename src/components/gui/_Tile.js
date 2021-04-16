import React from 'react';
import styled from "styled-components/macro";

const Tile = styled.div`
  box-shadow: ${props => props.theme.middle_shadow}; // 1px 1px 5px rgba(0,0,0,0.4);
  border-radius: ${props => props.theme.border_radius};
  transition: box-shadow 0.15s, border-color 0.15s;
  border: 2px solid transparent;
  display: flex;
  background-color: ${props => props.theme.background};
  flex-direction: column;

  height: ${props => props.frugal ? 'auto' : '100%'};
  padding: ${props => props.padded ? props.theme.large_padding : 0};
  
  &:hover {
    box-shadow: ${props => props.theme.distant_shadow};
    border: 2px solid ${props => props.theme.brand_secondary_light};
    
    .hover-sensitive {
      text-decoration: underline;
    }
  }
`;

export default Tile;