import styled from 'styled-components';
import React, {Fragment} from "react";

const Wrapper = styled.div`
  display: flex;
`;

const IconContainer = styled.div`
  flex: ${props => props.theme.spacing[3]} 0 0;
  height: 100%;
  margin-top: ${props => props.theme.spacing[2]};
  color: ${props =>
    props.success ? props.theme.success :
        props.info ? props.theme.info :
            props.warning ? props.theme.warning :
                props.danger ? props.theme.danger : "grey"
    };
  
`;

const Message = styled.div`
  flex: 1 0 0;
  //border-radius: 3px;
  padding: ${props => props.theme.spacing[2]};
  border-left: 2px solid ${props =>
    props.success ? props.theme.success :
        props.info ? props.theme.info :
            props.warning ? props.theme.warning :
                props.danger ? props.theme.danger : "grey"
    };
`;

const Alert = props => {
    let iconID = "circle";
    if (props.success) iconID = "check-circle";
    if (props.info) iconID = "info";
    if (props.warning) iconID = "exclamation-circle";
    if (props.danger) iconID = "exclamation-triangle";
    return (
        <Wrapper {...props}>
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

