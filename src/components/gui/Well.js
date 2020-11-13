import styled from "styled-components/macro";

export default styled.div`
    background-color: ${props => props.theme.background};
    padding: 12px;
    border-radius: ${props => props.theme.border_radius};
    border: 1px solid ${props => props.theme.grey_4};
`;