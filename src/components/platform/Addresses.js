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

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch({
            type: ADDRESS.GET.REQUEST
        })
    }, [showForm]);

    return (
        <Container>
            <Row>
                {showForm &&
                    <AddressForm modal={true} cancel={() => setShowForm(false)} />
                }

                <Button label={"Neu"} onClick={() => setShowForm(true)}/>
                <div className={"col-lg-4 col-xs-12"}>
                    <h2>Rechnungsadressen</h2>

                        {addresses && addresses.filter(address=>address.is_invoice_addr).map(address => {
                            return <AddressWrapper>
                                <AddressView editable {...address}>{address.street}</AddressView>
                                <Button onClick={() => setShowForm(true)} label={"Bearbeiten"} />
                                <Button onClick={() => removeAddress(dispatch, address.id)} label={"Löschen"} />
                            </AddressWrapper>
                        })}

                </div>
                <div className={"col-lg-4 col-xs-12"}>
                    <h2>Lieferadressen</h2>
                    <div>
                        {addresses && addresses.filter(address=>!address.is_invoice_addr).map(address => {
                            return <AddressWrapper>
                                <AddressView editable {...address}>{address.street}</AddressView>
                                <Button onClick={() => setShowForm(true)} label={"Bearbeiten"} />
                                <Button onClick={() => removeAddress(dispatch, address.id)} label={"Löschen"} />
                            </AddressWrapper>
                        })}
                    </div>
                </div>
            </Row>
        </Container>
    );
};

export default Addresses;