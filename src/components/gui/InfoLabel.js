import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from "react-i18next";
import { Icon } from "./_Icon";

const Wrapper = styled.span`
  display: flex;
  
margin-bottom: 0.5rem;

  .icon {
      width: 2rem;
      align-self: center;
  }
`;

const InfoLabel = props => {
    const { t } = useTranslation();

    return (
        <Wrapper title={t(props.title)}>
            <Icon icon={props.icon} />
            <div className={'content'}>
                <small>{t(props.label)}</small><br />
                {props.components ?
                props.components
                :
                <strong>{props.noTranslate ? props.info : t(props.info)}</strong>
                }
            </div>
        </Wrapper>
    )
};

export default InfoLabel;