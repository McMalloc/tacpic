import React from "react";

export default props => {
    return (
        <p onClick={props.onClick} style={{border:"1px solid teal",margin:3, padding: 2, backgroundColor: "turquoise"}}>{props.id}: {props.title} ({props.variants.length} Varianten)</p>
    )
};