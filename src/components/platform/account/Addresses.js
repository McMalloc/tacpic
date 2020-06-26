import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ADDRESS} from "../../../actions/action_constants";
import {Textinput} from "../../gui/Input";
import Select from "../../gui/Select";
import {Checkbox} from "../../gui/Checkbox";
import {Row} from "../../gui/Grid";
import {Alert} from "../../gui/Alert";

const submitAddress = (dispatch, address) => {
    dispatch({
        type: ADDRESS.ADD.REQUEST,
        payload: address
    })
}

const Addresses = props => {
    const dispatch = useDispatch();

    const userID = useSelector(state=>state.user.logged_in);
    useEffect(() => {
        dispatch({
            type: ADDRESS.GET.REQUEST
        })
    })

    const form = <form className={"container"}>
        <Row>
            <div className={"col-xs-6"}>
                <Textinput name={"first_name"} label={"Vorname"}/>
            </div>
            <div className={"col-xs-6"}>
                <Textinput name={"lastname_name"} label={"Nachname"}/>
            </div>
        </Row>

        <Row>
            <div className={"col-xs-9"}>
                <Textinput required name={"street"} label={"Straße"}/>
            </div>
            <div className={"col-xs-3"}>
                <Textinput name={"house_number"} label={"Hausnummer"}/>
            </div>
        </Row>

        <Row>
            <div className={"col-xs-3"}>
                <Textinput name={"zip"}  label={"Postleitzahl"}/>
            </div>
            <div className={"col-xs-9"}>
                <Textinput name={"city"} label={"Stadt"}/>
            </div>
        </Row>

        <Row>
            <div className={"col-xs-6"}>
                <Select name={"state"} label={"Bundesland"} options={[{label: "Sachsen-Anhalt", value: "S-A"}]} />
            </div>
            <div className={"col-xs-6"}>
                <Select name={"country"} value={"DEU"} disabled options={[{label: "Deutschland", value: "DEU"}]} label={"Staat"}/>
                <Alert info>Zur Zeit unterstützen wir nur die Lieferung nach Deutschland.</Alert>
            </div>
        </Row>
    </form>

    return (
        <div className={"container"}>
            {/*<div className={"row"}>*/}
            {/*    <div className={"col-xs-12"}><h1>Adressen</h1></div>*/}
            {/*</div>*/}
            <div className={"row"}>
                <div className={"col-lg-4 col-xs-12"}>
                    {form}
                </div>
                <div className={"col-lg-4 col-xs-12"}>
                    <h2>Rechnungsadressen</h2>
                    <Checkbox label={"Separate Liefer- und Rechnungsadressen"} />
                </div>
                <div className={"col-lg-4 col-xs-12"}>
                    <h2>Lieferadressen</h2>

                </div>
            </div>
        </div>
    );
};

export default Addresses;