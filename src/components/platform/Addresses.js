import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ADDRESS} from "../../actions/action_constants";
import {Checkbox} from "../gui/Checkbox";
import {Container, Row} from "../gui/Grid";
import AddressForm from "./AddressForm";
import {Button} from "../gui/Button";
import AddressView from "./AddressView";
import styled from 'styled-components/macro';

const AddressWrapper = styled.div`
  display: flex;
  align-items: flex-end;
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

const Addresses = () => {
    const dispatch = useDispatch();
    const addresses = useSelector(state => state.user.addresses);
    const invoiceAddresses = addresses.filter(address => address.is_invoice_addr);
    const shippingAddresses = addresses.filter(address => !address.is_invoice_addr);

    const [showForm, setShowForm] = useState(false);
    const [initial, setInitial] = useState({is_invoice_addr: false});

    useEffect(() => {
        dispatch({
            type: ADDRESS.GET.REQUEST
        })
    }, [showForm]);

    return (
        <Container>
            <Row>
                <div className={"col-xs-12"}>
                    <Button label={"Neu"} onClick={() => {
                        setInitial({is_invoice_addr: false});
                        setShowForm(true);
                    }}/>
                </div>
            </Row>
            <Row>
                {showForm &&
                <AddressForm modal={true} initial={initial} cancel={() => setShowForm(false)}/>
                }

                {invoiceAddresses.length > 0 &&
                <div className={"col-sm-6 col-xs-12"}>

                    <h2>Rechnungsadressen</h2>
                    {invoiceAddresses.map(address => {
                        return <AddressWrapper>
                            <AddressView editable {...address}>{address.street}</AddressView>&emsp;
                            <Button onClick={() => {
                                setInitial(address);
                                setShowForm(true);
                            }} label={"Bearbeiten"}/>&emsp;
                            <Button onClick={() => removeAddress(dispatch, address.id)} label={"Löschen"}/>
                        </AddressWrapper>
                    })}

                </div>
                }

                <div className={"col-sm-6 col-xs-12"}>
                    {invoiceAddresses.length > 0 &&
                    <h2>Lieferadressen</h2>
                    }

                    <div>
                        {shippingAddresses.map(address => {
                            return <AddressWrapper>
                                <AddressView editable {...address}>{address.street}</AddressView>
                                &emsp;
                                <Button onClick={() => {
                                    setInitial(address);
                                    setShowForm(true);
                                }} label={"Bearbeiten"}/>
                                &emsp;
                                <Button onClick={() => removeAddress(dispatch, address.id)} label={"Löschen"}/>
                            </AddressWrapper>
                        })}
                    </div>
                </div>
            </Row>
        </Container>
    );
};

export default Addresses;