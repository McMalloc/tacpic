import React from 'react'
import transform from "./transform";
import patternTemplates from "./Patterns";

export default function SVGEllipse(props) {
    const template = props.pattern.template;
    const transformProperty = transform(props.x, props.y, props.angle, props.width, props.height);

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
                data-transformable={1}
                data-selectable={1}
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
                data-transformable={1}
                data-selectable={1}
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
            {template !== null && patternTemplates[template](props.pattern, props.uuid, props.fill)}
        </g>
    )
}