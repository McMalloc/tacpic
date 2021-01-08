import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
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
        const timer = setTimeout(() => setShowMessage(true), props.timeout || 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Wrapper large={props.large} className={"loader"}>
            <Icon icon={`cog fa-3x fa-spin`} />
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