import React from 'react'
import transform from "./transform";
import {createPattern} from "./Patterns";

export default function SVGEllipse(props) {
    const template = props.pattern.template;
    const transformProperty = transform(props.x, props.y, props.angle, 0, 0);

    return (
        <g>
            <ellipse
                id={props.uuid}
                data-uuid={props.uuid}
                transform={transformProperty}
                style={{
                    cursor: 'pointer',
                    fill: template !== null ? 'url(#pattern-' + template + '-' + props.uuid + '' : props.fill || "transparent",
                    stroke: props.pattern.offset ? props.fill : "black",
                    strokeWidth: props.border ? props.pattern.offset ? 20 : props.borderWidth : 0,
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
                strokeWidth={props.borderWidth}
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