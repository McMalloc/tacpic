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

const AddressWrapper = styled.div`
    background-color: ${props => props.theme.background};
  border-radius: ${props => props.theme.border_radius};
  border: 1px solid ${props => props.theme.grey_4};
  padding: ${props => props.theme.large_padding};
 margin-bottom: ${props => props.theme.large_padding};
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
                {invoiceAddresses.length === 0 && shippingAddresses.length === 0 &&
                <div className={'col-xs-12'}>
                    <Alert info>Noch keine Adressen vorhanden</Alert>
                </div>
                }

                {showForm &&
                <AddressForm modal={true} initial={initial} cancel={() => setShowForm(false)}/>
                }

                <div className={"col-sm-8 col-xs-12"}>
                        {addresses.map(address => {
                            return <AddressWrapper>
                                <AddressView editable {...address} />

                                <ButtonBar>
                                    <Button onClick={() => {
                                        setInitial(address);
                                        setShowForm(true);
                                    }} icon={'pen'} label={"Bearbeiten"}/>
                                    <Button icon={'times'} onClick={() => removeAddress(dispatch, address.id)}
                                            label={"Löschen"}/>
                                </ButtonBar>

                            </AddressWrapper>
                        })}
                </div>
            </Row>
            <Row>
                <div className={"col-sm-12"} style={{textAlign: "center"}}>
                    <br/>
                    <Button primary label={"Neu"} onClick={() => {
                        setInitial({is_invoice_addr: false});
                        setShowForm(true);
                    }}/>
                </div>
            </Row>
        </Container>
    );
};

export default Addresses;