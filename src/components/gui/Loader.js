import React, {Fragment} from 'react';
import styled from 'styled-components/macro';
import {useTranslation} from "react-i18next";

const Line = styled.div`
  
`;

const Loader = props => {
    const { t } = useTranslation();
    return (
        <Fragment>

        </Fragment>
    )
};

export default Loader;