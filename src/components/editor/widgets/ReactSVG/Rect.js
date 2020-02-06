import React from 'react'
import transform from "./transform";
import patternTemplates from "./Patterns";

export default function SVGRect(props) {
    const template = props.pattern.template;

    // TODO kann das Übergeben von Mustern generalisiert werden?
    let transformProperty = transform(props.x, props.y, props.angle, props.width, props.height);
    return (
        <g>
            <rect id={props.uuid}
                  transform={transformProperty}
                  style={
                      {
                          cursor: 'pointer',
                          fill: template !== null ? 'url(#pattern-' + template + '-' + props.uuid + '' : props.fill || "transparent"
                      }}
                  strokeWidth={props.pattern.offset ? 20 : 2}
                  data-transformable={1}
                  data-selectable={1}
                  stroke={props.pattern.offset ? props.fill : "black"}
                  clipPath={props.pattern.offset ? "url(#clip-" + props.uuid + ")" : null}
                  width={props.width}
                  height={props.height}/>

            {props.pattern.offset &&
            <rect
                id={"stroke-" + props.uuid}
                transform={transformProperty}
                style={{fill: "none"}}
                strokeWidth={2}
                data-transformable={1}
                data-selectable={1}
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

            {template !== null && patternTemplates[template](props.pattern, props.uuid, props.fill)}

            <text transform={transform(props.x + 2, props.y + 10, 0)} fontSize={9}
                  fill={'white'}>{props.uuid.substring(0, 4)}</text>


        </g>
    )
}