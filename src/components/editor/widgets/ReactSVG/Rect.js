import React from 'react'
import transform from "./transform";
import patternTemplates from "./Patterns";

export default function SVGRect(props) {
    // TODO: wenn Farbe mit Textur geändert wird, aktualisiert sich das Objekt trotz anderem Pattern nicht. Irgendwas muss sich daher auch im style-String ändern
    const template = props.pattern.template;

    return (
        <g>
            <rect
                id={props.uuid}
                transform={transform(props.x, props.y, props.angle, props.width, props.height)}
                style={
                    {cursor: 'pointer', fill: template !== null ? 'url(#pattern-' + template + '-' + props.uuid + '' : props.fill || "transparent"}}
                strokeWidth={2}
                data-transformable={1}
                data-selectable={1}
                stroke={'rgba(0,50,100,0.2)'}
                width={props.width}
                height={props.height}
            />
            <text transform={transform(props.x+2, props.y+10, 0)} fontSize={9} fill={'white'}>{props.uuid.substring(0, 4)}</text>
            {template !== null && patternTemplates[template](props.pattern, props.uuid, props.fill)}
        </g>
    )
}