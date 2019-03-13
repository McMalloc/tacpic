import styled from 'styled-components';
import React, {Fragment} from "react";

const Wrapper = styled.div`
  display: flex;
  background-color: ${props => 
    props.success ? props.theme.success : 
        props.info ? props.theme.info :
            props.warning ? props.theme.warning :
                props.danger ? props.theme.danger : "grey"
    };
  //border-radius: 3px;
  //border-radius: 20px 0 0 20px;
`;

const IconContainer = styled.div`
  flex: 3.5em 0 0;
  margin: auto;
  text-align: center;
  color: white;
  height: 100%;
`;

const Message = styled.div`
  flex: 1 0 0;
  //border-radius: 3px;
  margin: 2px;
  padding: 1em;
  background-color: ${props => props.theme.background};
`;

const Alert = props => {
    let iconID = "circle";
    if (props.success) iconID = "check-circle";
    if (props.info) iconID = "info";
    if (props.warning) iconID = "exclamation-circle";
    if (props.danger) iconID = "exclamation-triangle";
    return (
        <Wrapper {...props}>
            <IconContainer>
                <i className={"fas fa-2x fa-" + iconID} />
            </IconContainer>
            <Message>
                {props.children}
            </Message>
        </Wrapper>
    )
};

export {Alert}
// const Flyout = props => {
//       return <div></div>
// };

