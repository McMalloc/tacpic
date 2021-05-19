import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';

// TODO: Minimieren-Button
const Wrapper = styled.div`
    width: 100%;
`;

const AdminGraphics = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        // dispatch({ type:  })
    })


    return (
        <Wrapper>
            drafts
        </Wrapper>
    )
};

export default AdminGraphics;