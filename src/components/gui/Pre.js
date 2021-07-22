import styled  from 'styled-components';
import React  from "react";

export const Pre = styled.pre`
  white-space: pre-wrap;
  font-size: 0.8rem;
  border-radius: 2px;
  border: 1px solid ${({theme}) => theme.grey_5};
  padding: 0.5rem;
  background-color: ${({theme}) => theme.grey_6};
`;

