import React, {useEffect} from 'react';
import styled from "styled-components";

const Tile = styled.div`
  box-shadow: ${props => props.theme.middle_shadow}; // 1px 1px 5px rgba(0,0,0,0.4);
  border-radius: ${props => props.theme.border_radius};
  transition: box-shadow 0.15s, border-color 0.15s;
  border: 1px solid whitesmoke;
  display: flex;
  background-color: ${props => props.theme.background};
  flex-direction: column;
  height: 100%;
  
  &:hover {
    box-shadow: ${props => props.theme.distant_shadow};
    border: 1px solid ${props => props.theme.brand_secondary_light};
    
    .hover-sensitive {
      text-decoration: underline;
    }
  }
`;

export default Tile;