import styled from "styled-components";

const Hint = styled.div`
  position: relative;
  width: 250px;
  //border: 1px solid ${props => props.theme.accent_1};
  box-shadow: ${props => props.theme.distant_shadow};
  border-radius: 3px;
  background-color: ${props => props.theme.background};
  padding: ${props => props.theme.spacing[2]};
 
`;

export default Hint;