import styled from 'styled-components';
import React, {Component} from "react";
import {createPortal} from "react-dom";
import {fadeIn, slideFromAbove} from "./Animations";
import {Icon} from "./_Icon";
import {Button} from "./Button";
import ReactTooltip from "react-tooltip";

const Backdrop = styled.div`
  
`;

/* TODO: eigenen Tooltip implementieren
*
* - einmaliges Setzen der Komponente, z.B. im Editor
* - Vergabe von i17n-Strings mit data-tip (wie react-tooltip)
* - Custom Inhalt: Schließen-Button und weiterführender Link
* - direkte JSX-Eingabe im Attribut (geht das bei nativen Attributen?)
* - Kopplung von i17n-Quellen und Knowledge Base (vermutlich durch i18nnext Backend)
* - CMS für Übersetzungen?
*
* */

const Tooltip = props => {
    return <ReactTooltip clickable={true} className={"tooltip"} html={true} effect={"solid"} delayShow={1000} delayHide={200}/>
};


export default Tooltip;