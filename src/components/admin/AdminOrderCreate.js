import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { ORDER_ADMIN } from "../../actions/action_constants";
import { Textinput } from '../gui/Input';

const Wrapper = styled.div`
  width: 100%;
`;

const AdminOrderCreate = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: ORDER_ADMIN.INDEX.REQUEST })
        document.title = "Bestellungen | tacpic";
    }, [])

    const [modalContent, setModalContent] = useState(null);
    
    return (
        <Wrapper>
            <Textinput label={'userId'} />
            <Textinput label={'totalGross'} />
            <Textinput label={'totalNet'} />
            <Textinput label={'totalNet'} />
        </Wrapper>
    )
};

export default AdminOrderCreate;