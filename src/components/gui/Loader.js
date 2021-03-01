import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components/macro';
import {useTranslation} from "react-i18next";
import {Icon} from "./_Icon";
import {fadeIn} from "./Animations";

const Wrapper = styled.div`
  height: 100%;
  min-height: ${props => props.frugal ? 0 : 200}px;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  display: flex;
  padding: 0.5rem; 
  box-sizing: border-box;
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
        const timer = setTimeout(() => setShowMessage(true), props.timeout || 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Wrapper frugal={props.frugal} large={props.large} className={"loader"}>
            <Icon icon={`cog fa-${props.frugal ? 1 : 3}x fa-spin`} />
            {!!props.message && showMessage ?
                <Message>{t(props.message)}</Message>
                : <p>&ensp;</p>
            }
        </Wrapper>
    )
};

export default Loader;

Loader.propTypes = {
  large: PropTypes.bool,
  message: PropTypes.string,
  timeout: PropTypes.number
}