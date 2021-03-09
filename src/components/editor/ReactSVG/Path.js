import React from 'react'
import './Path.css';
import { createPattern } from "./Patterns";
import { getRotation } from "../../../utility/geometry";
import methods from "./methods/methods";
import { buildPath } from "./PathGeneration";
import { COLOURS } from '../../../config/constants';

export default function SVGPath(props) {
    const path = buildPath(props.points, props.closed);
    // const smoothPathC = buildPath(props.points, cubicCommand, props.closed);
    // const smoothPathQ = buildPath(props.points, quadraticCommand, props.closed);

    const [offsetX, offsetY] = methods.path.getOffset(props);
    const transformProperty = `translate(${props.x} ${props.y}) scale(${props.scaleX} ${props.scaleY}) rotate(${props.angle} ${offsetX} ${offsetY})`;

    let startPoint, secondPoint, lastPointCoords, secondLastPointCoords = [];
    if (props.startArrow) {
        [startPoint, secondPoint] = methods.path.getCoordsForStartRotation(props);
    }

    if (props.endArrow) {
        [lastPointCoords, secondLastPointCoords] = methods.path.getCoordsForEndRotation(props);
    }

    const neutralBorder = <path
        className={"neutral-border"}
        style={
            {
                stroke: "white",
                fill: "none",
                strokeWidth: 20
            }}
        d={path}
    />

    return (
        <g data-selectable={1} id={props.uuid} transform={transformProperty}>

            {props.startArrow &&
                <polygon
                    stroke={'white'}
                    stroke-width={'2mm'}
                    transform={
                        `translate(${startPoint.join(',')}) 
                        rotate(-${getRotation(startPoint, secondPoint) + 45})`}
                    points={"-22,-22 18,-12 -12,18"} />

            }

            {props.endArrow &&
                <polygon
                    stroke={'white'}
                    stroke-width={'2mm'}
                    transform={
                        `translate(${lastPointCoords.join(',')}) 
                        rotate(-${getRotation(lastPointCoords, secondLastPointCoords) + 45})`}
                    points={"-22,-22 18,-12 -12,18"} />

            }

            {!(props.fill === COLOURS.none) && neutralBorder}
            <path
                style={{
                    stroke: props.pattern.offset ? props.fill : "black",
                    fill: props.pattern.template !== null ? 'url(#pattern-' + props.pattern.template + '-' + props.uuid + '' : props.fill || "none",
                    strokeWidth: props.border ? props.pattern.offset ? ((props.borderWidth / 2) + 4) + 'mm' : props.borderWidth + "mm" : 0,
                }}
                d={path}
                className={"border texture-offset"}
                data-uuid={props.uuid}
                strokeDasharray={props.pattern.offset ? null : props.borderStyle}
                id={props.uuid}
                data-transformable={!props.inactive}
                data-selectable={true}
                clipPath={props.pattern.offset ? "url(#clip-" + props.uuid + ")" : null}
            />

            {props.fill === COLOURS.none && neutralBorder}

            {props.pattern.offset && props.border &&
                <path
                    id={"stroke-" + props.uuid}
                    data-uuid={props.uuid}
                    data-transformable={!props.inactive}
                    data-selectable={true}
                    strokeDasharray={props.borderStyle}
                    strokeWidth={props.borderWidth + "mm"}
                    fill={'none'}
                    stroke={"rgba(0,0,0,1)"}
                    d={path}
                />
            }

            {props.pattern.offset &&
                <clipPath id={"clip-" + props.uuid}>
                    <path d={path} />
                </clipPath>
            }

            {props.pattern.template !== null &&
                createPattern(props.pattern.template, props.uuid, props.fill)
            }
        </g>
    )
}