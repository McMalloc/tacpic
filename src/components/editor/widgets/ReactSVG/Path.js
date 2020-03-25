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

// TODO in geometry.js
const getRotation = (pointA, pointB) => {
    const deltaY = pointA[1] - pointB[1];
    const deltaX = pointB[0] - pointA[0];
    const result = 180 / Math.PI * (Math.atan2(deltaY, deltaX));
    console.log(deltaY, deltaX, result);
    // return 0;
    return (result < 0) ? (360 + result) : result;
};

export default function SVGPath(props) {
    const path = buildPath(props.points);
    return (
        <g transform={transform(props.x, props.y, props.angle)}>
            <path
                stroke={props.border ? "black" : "none"}
                strokeWidth={props.borderWidth + "mm"}
                strokeLinecap={"butt"}
                style={
                    {
                        fill: props.pattern.template !== null ? 'url(#pattern-' + props.pattern.template + '-' + props.uuid + '' : props.fill || "transparent",
                        // cursor: 'pointer'
                    }
                    }
                id={'outline_' + props.uuid}
                d={path}
                data-transformable={1}
                data-selectable={1}
            />
            <path
                stroke={"rgba(100,100,100,0.15)"}
                strokeWidth={props.border ? 10 : 0}
                style={
                    {
                        fill: 'none', cursor: "pointer"}
                }
                id={props.uuid}
                d={path}
                data-transformable={1}
                data-selectable={1}
            />
            {props.startArrow &&
                <polygon transform={`translate(${props.points[0].coords.toString()}) rotate(-${getRotation(props.points[0].coords, props.points[1].coords)+45})`}
                         points={"-10,-10 20,0 0,20"} />
            }
            {/*<text width={500} y={12} x={2} fontSize={10} fill={'red'}>{buildPath(props.points)}</text>*/}
            {props.pattern.template !== null &&
                patternTemplates[props.pattern.template](props.pattern, props.uuid, props.fill)
            }
        </g>

    )
}