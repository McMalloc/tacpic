import React from 'react'
import transform from "./transform";

export default function SVGLine(props) {

    let transformProperty = transform(props.x, props.y);
    return (
        <g>
            <line id={props.uuid}
                  transform={transformProperty}
                  strokeWidth={2}
                  data-transformable={1}
                  data-selectable={1}
                  stroke={props.pattern.offset ? props.fill : "black"}
                  clipPath={props.pattern.offset ? "url(#clip-" + props.uuid + ")" : null}
                  width={props.width}
                  height={props.height}/>
        </g>
    )
}