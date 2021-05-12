import React from "react";
import {useTranslation} from "react-i18next";

const AddressView = props => {
    const {t} = useTranslation();

    return (<div>
        {!!props.company_name && <>{props.company_name} <br/></>}
        {props.first_name} {props.last_name} <br />
        {props.street} {props.house_number} <br />
        {props.zip} {props.city}
    </div>)
}

export default AddressView;