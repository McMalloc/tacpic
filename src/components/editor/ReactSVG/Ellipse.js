import React from 'react'
import transform from "./transform";
import {createPattern} from "./Patterns";

export default function SVGEllipse(props) {
    const template = props.pattern.template;
    const xVectorUnits = Number.isInteger(props.x);
    const yVectorUnits = Number.isInteger(props.y);

    const transformProperty = transform(
        xVectorUnits ? props.x : 0,
        yVectorUnits ? props.y : 0,
        props.angle, props.width, props.height);

    return (
        <g>
            <ellipse data-uuid={props.uuid}
                     className={"neutral-border"}
                  x={xVectorUnits ? null : props.x}
                  y={yVectorUnits ? null : props.y}
                  transform={transformProperty}
                  style={
                      {
                          stroke: "white",
                          fill: "transparent",
                          strokeWidth: 20
                      }}
                  rx={props.width}
                  ry={props.height}/>
            <ellipse
                id={props.uuid}
                data-uuid={props.uuid}
                transform={transformProperty}
                style={{
                    fill: template !== null ? 'url(#pattern-' + template + '-' + props.uuid + '' : props.fill || "transparent",
                    stroke: props.pattern.offset ? props.fill : "black",
                    strokeWidth: props.border ? props.pattern.offset ? 20 : props.borderWidth + 'mm' : 0,
                    strokeDasharray: props.pattern.offset ? null : props.borderStyle
                }}
                clipPath={props.pattern.offset ? "url(#clip-" + props.uuid + ")" : null}
                data-transformable={!props.inactive}
                data-selectable={true}
                rx={props.width}
                ry={props.height}
            />

            {props.pattern.offset && props.border &&
            <ellipse
                id={"stroke-" + props.uuid}
                transform={transformProperty}
                style={{fill: "none"}}
                strokeWidth={props.borderWidth + 'mm'}
                strokeDasharray={props.borderStyle}
                data-transformable={!props.inactive}
                data-selectable={true}
                stroke={"black"}
                rx={props.width}
                ry={props.height}
            />
            }

            {props.pattern.offset &&
            <clipPath id={"clip-" + props.uuid}>
                <ellipse
                    rx={props.width}
                    ry={props.height}
                />
            </clipPath>
            }
            {template !== null && createPattern(props.pattern.template, props.uuid, props.fill, props.angle)}
        </g>
    )
}