import React from 'react'
import transform from "./transform";
import './Path.css';
import patternTemplates from "./Patterns";

export const buildPath = points => {
    // TODO runden entfernen
    if (!points) return '';
    return points.reduce((acc, point) => {
        // if (!(point.kind === 'L' || point.kind === 'M') && point.coords.length === 2) return acc;
        return acc + `${point.kind} ${point.coords.map(n => { return n; }).join(" ")} `;
    }, "").replace(/\s\s/g, " ").trim();
};

export default function SVGPath(props) {
    return (
        <g>
            <path
                stroke={"black"}
                transform={transform(props.x, props.y, props.angle)}
                style={
                    {
                        cursor: 'pointer',
                        fill: props.pattern.template !== null ? 'url(#pattern-' + props.pattern.template + '-' + props.uuid + '' : props.fill || "transparent"}
                    }
                id={props.uuid}
                d={buildPath(props.points)}
                data-transformable={1}
                data-selectable={1}
            />
            <text width={500} y={12} x={2} fontSize={10} fill={'red'}>{buildPath(props.points)}</text>
            {props.pattern.template !== null &&
                patternTemplates[props.pattern.template](props.pattern, props.uuid, props.fill)
            }
        </g>

    )
}