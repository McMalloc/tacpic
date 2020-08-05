import PropTypes from "prop-types";
import React from "react";
import AddressForm from "./AddressForm";
import {useTranslation} from "react-i18next";
import styled from 'styled-components/macro';
import Card from "../gui/Card";

const Wrapper = styled.div`
`;

const AddressView = props => {
    const {t} = useTranslation();

    return (<Wrapper>
        {props.first_name} {props.last_name} <br />
        {props.street} {props.house_number} <br />
        {props.zip} {props.city}

        {/*{props.state && <span>({t(props.state)})</span>} <br />*/}
        {/*{t(props.country)}*/}
    </Wrapper>)
}

AddressView.propTypes = {
    is_invoice_addr: PropTypes.bool,
    street: PropTypes.string.isRequired,
    house_number: PropTypes.string.isRequired,
    company_name: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    additional: PropTypes.string,
    city: PropTypes.string.isRequired,
    zip: PropTypes.number.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
}

export default AddressView;