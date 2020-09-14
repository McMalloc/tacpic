import React, {Fragment, useEffect, useState} from 'react';
import styled from 'styled-components/macro';
import {useTranslation} from "react-i18next";
import {Icon} from "./_Icon";
import {fadeIn} from "./Animations";

const Wrapper = styled.div`
  height: 100%;
  min-height: 200px;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  display: flex;
  text-align: center;
  animation: pulsating 0.8s infinite;
  font-size: ${props => props.large ? "120%" : "100%"};
`;

const Message = styled.p`
  animation: ${fadeIn} 0.5s ease-in;
`

const Loader = props => {
    const { t } = useTranslation();
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowMessage(true), props.timeout || 1000)
    }, []);

    return (
        <Wrapper large={props.large} className={"loader"}>
            <Icon icon={`cog fa-3x fa-spin`} />
            {showMessage ?
                <Message>{props.message}</Message>
                : <p>&ensp;</p>
            }
        </Wrapper>
    )
};

export default Loader;