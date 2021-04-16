import React from "react";
import ButtonBar from "../gui/ButtonBar";
import Popup from "../gui/Popup";
import { Button } from "../gui/Button";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

const Consent = () => {
  const dispatch = useDispatch();
  return <Popup icon={'cookie'} delay={2}>
    <p>
      Cookies und ähnliche Technologien werden zur bedarfsgerechten und zielgerichteten Gestaltung dieses Webauftritts genutzt.
      Darüber hinaus verarbeiten wir anonym technische Daten zum Zweck einer Zugriffsstatistik ("Tracking").
    </p><p>
      <NavLink to={"/info/de/65?Datenschutzerklärung"}>Lesen Sie hier</NavLink> unsere Datenschutzerklärung. Sie können dort auch das Tracking komplett unterbinden ("Opt-Out"). Sollten Sie in Ihrem Browser die Do-not-Track-Option gewählt haben, wird diese respektiert.
    </p>

    <ButtonBar align={'right'}>
      <Button onClick={() => dispatch({ type: 'GDPR_OKAY' })} icon={'thumbs-up'} label={'Okay'} />
    </ButtonBar>
  </Popup>
    ;
};

export default Consent;