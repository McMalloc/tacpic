import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import AdminUsers from './AdminUsers';

// TODO: Minimieren-Button
const Wrapper = styled.div`

`;

const AdminIndex = props => {
    const { t } = useTranslation();
    const user = useSelector(state => state.user);

    if (user.role !== 1) return null;
    return (
        <Wrapper>
            <AdminUsers />
        </Wrapper>
    )
};

export default AdminIndex;