import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';

// TODO: Minimieren-Button
const Wrapper = styled.div`

`;

const AdminGraphics = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        // dispatch({ type:  })
    })


    return (
        <Wrapper>
            admin
        </Wrapper>
    )
};

export default AdminGraphics;