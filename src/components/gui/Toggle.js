import styled from 'styled-components';
import React from "react";
import {Button} from "./Button";
import {useTranslation} from "react-i18next";

const ToggleButton = styled(Button)`
  &[aria-pressed="true"] {
    background-color: ${props => props.theme.accent_1};
    box-shadow: inset 2px 2px 1px rgba(0,0,0,0.4);
    text-shadow: 0 0 1px ${props => props.theme.background};
    color: ${props => props.theme.foreground};
  }
`;

const Toggle = props => {
    const { t } = useTranslation();

    return (
        <ToggleButton aria-pressed={props.toggled}
                      onClick={props.onClick}
                      primary={props.primary}
                      icon={props.icon}
                      disabled={props.disabled}
                      fullWidth={props.fullWidth}
                      aria-label={t(props.label)}>
            {t(props.label)}
        </ToggleButton>
    )
};

export default Toggle;