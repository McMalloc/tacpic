import styled from 'styled-components';
import React from "react";

const Wrapper = styled.div`
  display: flex;
  margin: ${props => props.theme.spacing[1]} 0;
  border-radius: ${props => props.theme.border_radius};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  background-color: ${props => props.theme.foreground};
  border-bottom: 5px solid ${props =>
    props.success ? props.theme.success_dark :
        props.info ? props.theme.info :
            props.warning ? props.theme.warning :
                props.danger ? props.theme.danger : "white"
};
  a {
    color: ${props => props.theme.background};
  }
`;

const IconContainer = styled.div`
  flex: ${props => props.theme.spacing[2]} 0 0;
  height: 100%;
  color: ${({theme}) => theme.background};
  margin-right: ${props => props.theme.spacing[2]};
`;

const Message = styled.div`
  flex: 1 0 0;
  color: ${({theme}) => theme.background};
`;

const Alert = props => {
    let iconID = "circle";
    if (props.success) iconID = "check-circle";
    if (props.info) iconID = "info";
    if (props.warning) iconID = "hand-point-up";
    if (props.danger) iconID = "exclamation-triangle";
    return (
        <Wrapper role={(props.warning || props.danger) ? "alert" : ""} {...props}>
            <IconContainer {...props}>
                <i className={"fas fa-" + iconID} />
            </IconContainer>
            <Message {...props}>
                {props.children}
            </Message>
        </Wrapper>
    )
};

export {Alert}
// const Flyout = props => {
//       return <div></div>
// };

