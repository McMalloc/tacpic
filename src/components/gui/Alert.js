import styled, { ThemeContext } from 'styled-components';
import React, { useContext } from "react";
import { Trans, useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  display: flex;
  margin: ${props => props.theme.spacing[1]} 0;
  box-shadow: ${props => props.theme.middle_shadow};
  border-radius: ${props => props.theme.border_radius};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[2]};
  border: 0px solid ${props => props.colour};
  background-color: ${props => props.colourBG};

  strong {
    color: ${props => props.colour};
  }
`;

const IconContainer = styled.div`
  flex: ${props => props.theme.spacing[2]} 0 0;
  height: 100%;
  color: ${props => props.colour};
  margin-right: ${props => props.theme.spacing[2]};
`;

const Message = styled.div`
  flex: 1 0 0;
  line-height: 1.4;
`;

const Alert = props => {
    let iconID = "circle";
    const { t } = useTranslation();
    const theme = useContext(ThemeContext);
    let colour = theme.brand_secondary;
    let colourBG = theme.brand_secondary;
    let type = "default";
    if (props.success) {
        iconID = "check-circle";
        type = "success";
    }
    if (props.info) {
        iconID = "info";
        type = "info";
    }
    if (props.warning) {
        iconID = "hand-point-right";
        type = "warning";
    }
    if (props.danger) {
        iconID = "exclamation-triangle";
        type = "danger";
    }
    if (props.complimentaryCopy) {
        iconID = "carret-right";
    }
    return (
        <Wrapper role={(props.warning || props.danger) ? "alert" : ""} {...props} colour={theme[type + '_dark']} colourBG={theme[type + '_light']}>
            <IconContainer aria-hidden={true} colour={theme[type + '_dark']}>
                <i className={"fas fa-" + iconID} />
            </IconContainer>
            <Message {...props}>
                <strong>{t("alert_" + type)}: </strong>
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

