import React from 'react'
import transform from "./transform";

export default function SVGGroup(props) {
    return (
        <g id={props.uuid} data-transformable={1} data-group={1}
           data-selectable={1} transform={transform(props.x, props.y, props.angle)}>
            {props.children}
        </g>
    )
}