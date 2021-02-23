import React from "react";
import ButtonBar from "../gui/ButtonBar";
import Popup from "../gui/Popup";
import {Icon} from "../gui/_Icon";
import { Button } from "../gui/Button";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

const Consent = props => {
    const dispatch = useDispatch();
    return <Popup icon={'cookie'}>
    Diese Seite nutzt Cookies und ähnliche Technologien, 
    jedoch nicht zum analytischen Rückverfolgen ("Tracking"). 
    <br /><br />
    <NavLink to={"/info/de/65?Datenschutzerklärung"}>Lesen Sie hier</NavLink>, unsere Datenschutzerklärung. Sie können dort auch das Tracking komplett unterbinden ("Opt-Out").
    <ButtonBar align={'right'}>
      <Button onClick={() => dispatch({type: 'GDPR_OKAY'})} icon={'thumbs-up'} label={'Okay'}/>
    </ButtonBar>
  </Popup>
  ;
};

export default Consent;