import React, {useState} from "react";
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {ADDRESS} from "../../actions/action_constants";
import {Textinput} from "../gui/Input";
import Select from "../gui/Select";
import {Row} from "../gui/Grid";
import Modal from "../gui/Modal";
import {EWR, GERMAN_STATES} from "../../config/constants";

const submitAddress = (dispatch, address) => {
    dispatch({
        type: address.id === null ? ADDRESS.CREATE.REQUEST : ADDRESS.UPDATE.REQUEST,
        payload: address
    })
}

export const defaults = {
    is_invoice_addr: false,
    street: "",
    house_number: "",
    company_name: "",
    first_name: "",
    last_name: "",
    additional: "",
    city: "",
    zip: "",
    state: "",
    id: null,
    country: "DEU"
}

const AddressForm = props => {
    const dispatch = useDispatch();
    const [address, changeAddress] = useState({ ...defaults, ...props.initial });

    const setState = event => {
        const updatedModel = {...address, [event.target.name]: event.target.value, id: null};
        console.dir(updatedModel);
        props.modelCallback && props.modelCallback(updatedModel);
        changeAddress(updatedModel);
    }

    const form = <>
        {/*// < id={props.id} style={{width: props.modal ? 600 : 'auto'}} className={"container"}>*/}
        <Row>
            <div className={"col-xs-6"}>
                <Textinput required={address.company_name.length === 0} onChange={setState}
                           value={address.first_name}
                           name={"first_name"} label={"Vorname"}/>
            </div>
            <div className={"col-xs-6"}>
                <Textinput required={address.company_name.length === 0} onChange={setState}
                           value={address.last_name}
                           name={"last_name"} label={"Nachname"}/>
            </div>
        </Row>

        <Row>
            <div className={"col-xs-6"}>
                <Textinput required={address.last_name.length === 0} onChange={setState}
                           value={address.company_name}
                           name={"company_name"} label={"Firmenname"}/>
            </div>
        </Row>

        <Row>
            <div className={"col-xs-9"}>
                <Textinput required onChange={setState} value={address.street} name={"street"}
                           label={"Straße"}/>
            </div>
            <div className={"col-xs-3"}>
                <Textinput required onChange={setState} value={address.house_number} name={"house_number"}
                           label={"Hausnummer"}/>
            </div>
        </Row>

        <Row>
            <div className={"col-xs-9"}>
                <Textinput required onChange={setState} value={address.city} name={"city"} label={"Stadt"}/>
            </div>
            <div className={"col-xs-3"}>
                <Textinput validations={[
                    {
                        fn: val => /[0-9]+/.test(val), message: "general:zip-invalid", callback: () => {
                        }
                    }
                ]} required onChange={setState} value={address.zip} name={"zip"} label={"Postleitzahl"}/>
            </div>
        </Row>

        <Row>
            <div className={"col-xs-6"}>
                <Select onChange={({label, value}) => {
                    changeAddress({...address, state: value})
                }}
                        value={address.state} name={"state"} label={"Bundesland"}
                    options={GERMAN_STATES} />
            </div>
            <div className={"col-xs-6"}>
                <Select value={address.country} name={"country"} disabled={!address.is_invoice_addr}
                        onChange={(label, value) => changeAddress({...address, country: value})}
                        options={address.is_invoice_addr ? EWR : [{label: "Deutschland", value: "DEU"}]}
                        label={"Staat"}/>
                {/*{(!address.is_invoice_addr) &&*/}
                {/*        <small>Zur Zeit unterstützen wir nur die Lieferung nach Deutschland.</small>*/}
                {/*}*/}
            </div>
            <div>
                *: erforderlich
            </div>
        </Row>

        {/*{('is_invoice_addr' in props.initial) &&*/}
        {/*<Row>*/}
        {/*    <div className={"col-xs-12"}>*/}
        {/*        <Checkbox onChange={event => {*/}
        {/*            changeAddress({*/}
        {/*                ...address,*/}
        {/*                is_invoice_addr: event.target.checked,*/}
        {/*                country: !event.target.checked ? "DEU" : address.country*/}
        {/*            });*/}
        {/*        }}*/}
        {/*                  value={address.is_invoice_addr}*/}
        {/*                  name={"is_invoice_addr"}*/}
        {/*                  label={"Es handelt sich ausschließlich um eine Rechnungsadresse (d.h. sie taucht nicht in der Auswahl für die Lieferadresse auf)."}/>*/}

        {/*    </div>*/}
        {/*</Row>*/}
        {/*}*/}
        </>
    {/*</form>*/}

    if (props.modal) {
        return (
            <Modal fitted actions={[
                {
                    label: "Verwerfen",
                    name: "cancel-address-form",
                    align: "left",
                    action: props.cancel
                },
                {
                    label: "Adresse anlegen",
                    name: "confirm-address-form",
                    align: "right",
                    template: 'primary',
                    submitFor: "address-edit-form",
                    disabled: false,
                    action: () => {
                        submitAddress(dispatch, address);
                        props.cancel();
                    }
                }
            ]} title={"Adresse hinzufügen"}>
                <form id={"address-edit-form"}>{form}</form>
            </Modal>
        )
    } else {
        return form
    }
};

AddressForm.propTypes = {
    initial: PropTypes.shape({
        is_invoice_addr: PropTypes.bool,
        street: PropTypes.string,
        house_number: PropTypes.string,
        company_name: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        additional: PropTypes.string,
        city: PropTypes.string,
        zip: PropTypes.number,
        state: PropTypes.string,
        country: PropTypes.string,
    }),
    submit: PropTypes.func,
    cancel: PropTypes.func,
    modal: PropTypes.bool
}

export default AddressForm;