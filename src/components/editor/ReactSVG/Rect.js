import React from 'react'
import transform from "./transform";
import { createPattern } from "./Patterns";
import { COLOURS } from '../../../config/constants';

export default function SVGRect(props) {
    const template = props.pattern.template;
    const xVectorUnits = Number.isInteger(props.x);
    const yVectorUnits = Number.isInteger(props.y);

    const transformProperty = transform(
        xVectorUnits ? props.x : 0,
        yVectorUnits ? props.y : 0,
        props.angle, props.width, props.height);

    const neutralBorder = <rect data-uuid={props.uuid}
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
        width={props.width}
        height={props.height} />

    return (
        <g>
            {neutralBorder}

            <rect id={props.uuid}
                data-uuid={props.uuid}
                x={xVectorUnits ? null : props.x}
                y={yVectorUnits ? null : props.y}
                transform={transformProperty}
                style={{
                        fill: template !== null ? 'url(#pattern-' + template + '-' + props.uuid + '' : props.fill !== null ? props.fill : "transparent",
                        stroke: props.pattern.offset ? props.fill : "black",
                        strokeWidth: props.border ? props.pattern.offset ? 20 : props.borderWidth + 'mm' : 0,
                        strokeDasharray: props.pattern.offset ? null : props.borderStyle
                    }}
                data-transformable={!props.inactive}
                data-selectable={true}
                clipPath={props.pattern.offset ? "url(#clip-" + props.uuid + ")" : null}
                width={props.width}
                height={props.height} />

            {/*{props.fill === COLOURS.none && neutralBorder}*/}

            {props.pattern.offset && props.border &&
                <rect
                    id={"stroke-" + props.uuid}
                    data-uuid={props.uuid}
                    transform={transformProperty}
                    style={{ fill: "none" }}
                    x={xVectorUnits ? null : props.x}
                    y={yVectorUnits ? null : props.y}
                    strokeWidth={props.borderWidth + 'mm'}
                    strokeDasharray={props.borderStyle}
                    data-transformable={!props.inactive}
                    data-selectable={true}
                    className={"object-rect"}
                    stroke={"black"}
                    width={props.width}
                    height={props.height}
                />
            }

            {props.pattern.offset &&
                <clipPath id={"clip-" + props.uuid}>
                    <rect
                        width={props.width}
                        height={props.height}
                    />
                </clipPath>
            }

            {template !== null && createPattern(template, props.uuid, props.fill, props.angle)}
        </g>
    )
}