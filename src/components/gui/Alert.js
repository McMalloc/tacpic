import styled, { ThemeContext } from 'styled-components';
import React, { useContext } from "react";
import { Trans } from 'react-i18next';

const Wrapper = styled.div`
  display: flex;
  margin: ${props => props.theme.spacing[1]} 0;
  border-radius: ${props => props.theme.border_radius};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[2]};
  border: 1px solid ${props => props.colour};
  border-bottom: 5px solid ${props => props.colour};
    background-color: white;
    box-shadow: 1px 1px 2px rgba(0,0,0,0.1) inset;
`;

const IconContainer = styled.div`
  flex: ${props => props.theme.spacing[2]} 0 0;
  height: 100%;
  color: ${props => props.colour};
  margin-right: ${props => props.theme.spacing[3]};
`;

const Message = styled.div`
  flex: 1 0 0;
  line-height: 1.4;
`;

const Alert = props => {
    let iconID = "circle";
    const theme = useContext(ThemeContext);
    let colour = theme.brand_secondary;
    if (props.success) {
        iconID = "check-circle";
        colour = theme.success_dark;
    }
    if (props.info) {
        iconID = "info";
        colour = theme.info;
    }
    if (props.warning) {
        iconID = "hand-point-right";
        colour = theme.warning;
    }
    if (props.danger) {
        iconID = "exclamation-triangle";
        colour = theme.danger;
    }
    if (props.complimentaryCopy) {
        iconID = "carret-right";
        colour = 'transparent';
    }
    return (
        <Wrapper role={(props.warning || props.danger) ? "alert" : ""} {...props} colour={colour}>
            <IconContainer colour={colour}>
                <i className={"fas fa-" + iconID} />
            </IconContainer>
            <Message {...props}>
                {props.i18nKey ?
                    <Trans i18nKey={props.i18nKey}>
                        {props.children}
                    </Trans>
                    :
                    props.children
                }

            </Message>
        </Wrapper>
    )
};

export { Alert }
// const Flyout = props => {
//       return <div></div>
// };

