import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ADDRESS, USER} from "../../actions/action_constants";
import {Checkbox} from "../gui/Checkbox";
import {Container, Row} from "../gui/Grid";
import AddressForm from "./AddressForm";
import {Button} from "../gui/Button";
import AddressView from "./AddressView";
import styled from 'styled-components/macro';
import {Alert} from "../gui/Alert";
import ButtonBar from "../gui/ButtonBar";
import Modal from "../gui/Modal";
import { useTranslation } from "react-i18next";

const AddressWrapper = styled.div`
    background-color: ${props => props.theme.background};
  border-radius: ${props => props.theme.border_radius};
  border: 1px solid ${props => props.theme.grey_4};
  padding: ${props => props.theme.large_padding};
 margin-bottom: ${props => props.theme.large_padding};
 margin-right: ${props => props.theme.large_padding};
`;

const updateAddress = (dispatch, address) => {
    dispatch({
        type: ADDRESS.UPDATE.REQUEST,
        payload: address
    })
}

const removeAddress = (dispatch, addressID) => {
    dispatch({
        type: ADDRESS.REMOVE.REQUEST,
        payload: {id: addressID}
    })
}

// TODO Bestätigungsdialog könnte refaktorisiert werden
const Addresses = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const addresses = useSelector(state => state.user.addresses);
    const invoiceAddresses = addresses.filter(address => address.is_invoice_addr);
    const shippingAddresses = addresses.filter(address => !address.is_invoice_addr);

    const [showForm, setShowForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [addressToBeRemoved, setAddressToBeRemoved] = useState({});
    const [initial, setInitial] = useState({ is_invoice_addr: false });

    // neccessary for showing added addresses immediately
    const shouldGetNewAddresses = !!showForm;

    useEffect(() => {
        dispatch({
            type: ADDRESS.GET.REQUEST
        })
    }, [shouldGetNewAddresses]);

    return (
        <>
            <Row>
                {invoiceAddresses.length === 0 && shippingAddresses.length === 0 &&
                <div className={'col-xs-12 col-sm-6 col-sm-offset-3'}>
                    <Alert info>{t('account:addressMenu.nonCreated')}</Alert>
                </div>
                }

                {showForm &&
                <AddressForm modal={true} initial={initial} cancel={() => setShowForm(false)}/>
                }

                {showConfirmModal &&
                <Modal fitted title={t('confirmRemove')} dismiss={() => setShowConfirmModal(false)} actions={[
                    {label: t('dontRemove'), action: () => setShowConfirmModal(false)},
                    {label: t('yesRemove'), template: "primary", align: "right", action: () => {
                            removeAddress(dispatch, addressToBeRemoved.id);
                            setShowConfirmModal(false);
                        }}
                ]}>
                    <p>{t('account:reallyRemoveAddress')}</p>
                    <AddressView {...addressToBeRemoved} />
                </Modal>
                }

                <div className={"col-xs-12 col-md-8 col-md-offset-2"}>
                    {addresses.map(address => {
                        return <AddressWrapper key={address.id}>
                            <AddressView editable {...address} />

                            <ButtonBar align={'right'}>
                                <Button onClick={() => {
                                    setInitial(address);
                                    setShowForm(true);
                                }} icon={'pen'} label={"edit"}/>
                                <Button icon={'times'} onClick={() => {
                                    setAddressToBeRemoved(address);
                                    setShowConfirmModal(true);
                                }}
                                        label={"remove"}/>
                            </ButtonBar>

                        </AddressWrapper>
                    })}
                </div>
            </Row>
            <Row>
                <div className={"col-xs-12"} style={{textAlign: "center"}}>
                    <br/>
                    <Button primary label={"account:add_address"} onClick={() => {
                        setInitial({is_invoice_addr: false, id: null});
                        setShowForm(true);
                    }}/>
                </div>
            </Row>
        </>
    );
};

export default Addresses;