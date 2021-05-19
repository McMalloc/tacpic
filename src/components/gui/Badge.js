import React from 'react';
import styled from 'styled-components/macro';

const Badge = styled.span`
  display: inline-block;
  position: relative;
  text-transform: uppercase;
  color: ${props => props.theme.background};
  font-size: 0.8rem;
  letter-spacing: 2px;
  border-radius: ${props => props.theme.border_radius};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background-color: ${props => !!props.state ? props.theme[props.state] : props.theme.midlight};
`;

export default Badge;