import React from 'react'
import './Path.css';
import {createPattern} from "./Patterns";
import {getRotation} from "../../../utility/geometry";
import methods from "./methods/methods";
import {buildPath, cubicCommand, lineCommand, quadraticCommand} from "./PathGeneration";

export default function SVGPath(props) {
    const path = buildPath(props.points, props.closed);
    // const smoothPathC = buildPath(props.points, cubicCommand, props.closed);
    // const smoothPathQ = buildPath(props.points, quadraticCommand, props.closed);

    const [offsetX, offsetY] = methods.path.getOffset(props);
    const transformProperty = `translate(${props.x} ${props.y}) scale(${props.scaleX} ${props.scaleY}) rotate(${props.angle} ${offsetX} ${offsetY})`;

    return (
        <g data-selectable={1} id={props.uuid} transform={transformProperty}>
            <path
                className={"neutral-border"}
                style={
                    {
                        stroke: "white",
                        fill: "transparent",
                        strokeWidth: 20
                    }}
                d={path}
            />
            <path
                style={{
                    stroke: props.pattern.offset ? props.fill : "black",
                    strokeWidth: props.border ? props.pattern.offset ? ((props.borderWidth / 2) + 4) + 'mm' : props.borderWidth + "mm" : 0,
                }}
                fill={props.pattern.template !== null ? 'url(#pattern-' + props.pattern.template + '-' + props.uuid + '' : props.fill || "none"}
                d={path}
                className={"border texture-offset"}
                data-uuid={props.uuid}
                id={props.uuid}
                data-transformable={!props.inactive}
                data-selectable={true}
                clipPath={props.pattern.offset ? "url(#clip-" + props.uuid + ")" : null}
            />

            {props.pattern.offset && props.border &&
            <path
                id={"stroke-" + props.uuid}
                data-uuid={props.uuid}
                data-transformable={!props.inactive}
                data-selectable={true}
                strokeDasharray={props.borderStyle}
                style={{
                    fill: "none",
                    strokeWidth: props.borderWidth + "mm",
                    strokeLinecap: "square",
                    stroke: "rgba(0,0,0,1)"
                }}
                d={path}
            />
            }

            {props.pattern.offset &&
            <clipPath id={"clip-" + props.uuid}>
                <path d={path}/>
            </clipPath>
            }

            {/*{!props.inPreview &&*/}
            {/*<path*/}
            {/*    stroke={"rgba(100,100,100,0.0)"}*/}
            {/*    strokeWidth={props.border ? 20 : 0}*/}
            {/*    style={*/}
            {/*        {*/}
            {/*            fill: 'none', cursor: "pointer"*/}
            {/*        }*/}
            {/*    }*/}
            {/*    data-uuid={props.uuid}*/}
            {/*    className={"no-print"}*/}
            {/*    d={path}*/}
            {/*    data-transformable={!props.inactive}*/}
            {/*    data-selectable={true}*/}
            {/*/>*/}
            {/*}*/}

            {props.startArrow &&
            <polygon
                transform={`translate(${props.x} ${props.y}) rotate(-${getRotation([props.x, props.y], props.points[1].coords) + 45})`}
                points={"-10,-10 20,0 0,20"}/>
            }

            {props.pattern.template !== null &&
            createPattern(props.pattern.template, props.uuid, props.fill)
            }
        </g>
    )
}