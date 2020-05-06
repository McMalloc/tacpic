import React from 'react'
import transform from "./transform";
import './Path.css';
import patternTemplates from "./Patterns";
import {getMidpoint, getRotation} from "../../../../utility/geometry";
import methods from "./methods";

// https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
export const buildPath = (points, command = lineCommand) => {
    // build the d attributes by looping over the points
    return points.reduce((acc, point, index, all) => index === 0
        // if first point
        ? `M ${point.coords[0]},${point.coords[1]}`
        // else
        : `${acc} ${command(point.coords, index, all.map(p => p.coords))}`
        , '');
};

const lineCommand = point => `L ${point[0]} ${point[1]}`;

const lineProps = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    }
};

const getControlPoint = (current, previous, next, reverse, smoothing = 0.1) => {
    const p = previous || current;
    const n = next || current;

    const opposedLine = lineProps(p, n);

    // If is end-control-point, add PI to the angle to go backward
    const angle = opposedLine.angle + (reverse ? Math.PI : 0);
    const length = opposedLine.length * smoothing;
    // The control point position is relative to the current point
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y]
};

export const cubicCommand = (point, index, all) => {
    // start control point
    const [cpsX, cpsY] = getControlPoint(all[index - 1], all[index - 2], point);
    // end control point
    const [cpeX, cpeY] = getControlPoint(point, all[index - 1], all[index + 1], true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
};

export const quadraticCommand = (point, index, all) => {
    if (index <= 1) return '';
    if (index === 2) {
        const [cpX, cpY] = getMidpoint(all[index - 1], point);
        return `Q ${all[index - 1][0]},${all[index - 1][1]} ${cpX},${cpY}`;
    }
    const [cpX, cpY] = getMidpoint(all[index - 1], point);
    return `T ${cpX},${cpY}`;
};

export default function SVGPath(props) {
    // const smoothPath = buildSmoothPath(props.points);
    const smoothPathC = buildPath(props.points, cubicCommand);
    const smoothPathQ = buildPath(props.points, quadraticCommand);
    const path = buildPath(props.points, lineCommand);
    let offsetX = 0;
    let offsetY = 0;

    if (props.angle !== 0) {
        let bbox = methods.path.getBBox(props);
        offsetX = bbox.width/2 + bbox.x - props.x;
        offsetY = bbox.height/2 + bbox.y - props.y;
    }

    return (
        <g transform={`translate(${props.x} ${props.y}) rotate(${props.angle} ${offsetX} ${offsetY})`}>
            <path
                stroke={props.border ? "black" : "none"}
                strokeWidth={props.borderWidth / 5 + "mm"}
                strokeLinecap={"butt"}
                style={
                    {
                        fill: props.pattern.template !== null ? 'url(#pattern-' + props.pattern.template + '-' + props.uuid + '' : props.fill || "none ",
                        // cursor: 'pointer'
                    }
                }
                id={'outline_' + props.uuid}
                d={smoothPathQ}
            />
            <path
                stroke={props.border ? "green" : "none"}
                strokeWidth={props.borderWidth / 5 + "mm"}
                strokeLinecap={"butt"}
                style={
                    {
                        fill: props.pattern.template !== null ? 'url(#pattern-' + props.pattern.template + '-' + props.uuid + '' : props.fill || "none ",
                        // cursor: 'pointer'
                    }
                }
                id={'outline_' + props.uuid}
                d={smoothPathC}
            />
            {!props.inPreview &&
            <path
                stroke={"rgba(100,100,100,0.05)"}
                strokeWidth={props.border ? 10 : 0}
                style={
                    {
                        fill: 'none', cursor: "pointer"
                    }
                }
                id={props.uuid}
                d={smoothPathC}
                // d={`M 0 0 ${smoothPath}`}
                data-transformable={1}
                data-selectable={1}
            />
            }

            {props.startArrow &&
            <polygon
                transform={`translate(${props.x} ${props.y}) rotate(-${getRotation([props.x, props.y], props.points[1].coords) + 45})`}
                points={"-10,-10 20,0 0,20"}/>
            }
            {/*<text width={500} y={12} x={2} fontSize={10} fill={'red'}>{buildPath(props.points)}</text>*/}
            {props.pattern.template !== null &&
            patternTemplates[props.pattern.template](props.pattern, props.uuid, props.fill)
            }
        </g>

    )
}