import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import AdminUsers from './AdminUsers';
import AdminErrors from './AdminErrors';

// TODO: Minimieren-Button
const Wrapper = styled.div`

`;

const AdminIndex = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.user);

    if (user.role !== 1) return null;
    return (
        <Wrapper>
            {/* <AdminUsers /> */}
            <AdminErrors />
        </Wrapper>
    )
};

export default AdminIndex;