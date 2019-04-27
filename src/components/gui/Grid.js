import styled from 'styled-components';
import React, {Fragment} from "react";

const ProtoRow = styled.div`
  margin-bottom: ${props => 
    props.padded ? props.theme.spacing[parseInt(props.padded) || 1] : 0};
`;

const Row = props => {
    return (
        <ProtoRow {...props} className={"row " + props.modifier}>{props.children}</ProtoRow>
    )
};

const Column = props => {
    let classes = "";

    // TODO cleveres System überlegen, das hier funktioniert nicht so gut.
    console.log(props.width);

    // props.narrow ?  classes += "col-xs-6 col-sm-4 col-md-3 col-lg-2"    : null;
    // props.medium ?  classes += "col-xs-12 col-sm-6 col-md-4 col-lg-3"   : null;
    // props.wide ?    classes += "col-xs-12 col-sm-12 col-md-6 col-lg-4"  : null;
    // props.full ?    classes += "col-xs-12"                              : null;
    // props.half ?    classes += "col-xs-12 col-sm-12 col-md-6 col-lg-6"  : null;

    // z.B. width={1/4}
    // Nenner gibt an, ob die Spalten sm, md, lg bassiert sein sollen, Zähler die Breite
    console.log(classes);
    return (
        <div className={classes}>{props.children}</div>
    )
};

export {Row, Column}
// const Flyout = props => {
//       return <div></div>
// };

