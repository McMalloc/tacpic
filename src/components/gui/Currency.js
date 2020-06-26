import React from "react";

const Currency = props => {
    // get current regional currency from hook/state
    return (
        <span>
            {(props.amount / 100).toFixed(2).replace('.', ',')}&thinsp;€
        </span>
    )
};


export {Currency}