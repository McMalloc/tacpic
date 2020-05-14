import React from 'react'
import transform from "./transform";
import './Path.css';
import patternTemplates, {createPattern} from "./Patterns";
import {getRotation} from "../../../../utility/geometry";
import methods from "./methods";
import {buildPath, cubicCommand} from "./PathGeneration";

export default function SVGPath(props) {
    const smoothPathC = buildPath(props.points, cubicCommand, props.closed);
    // const smoothPathQ = buildPath(props.points, quadraticCommand, props.closed);

    const [offsetX, offsetY] = methods.path.getOffset(props);
    const transformProperty = `translate(${props.x} ${props.y}) rotate(${props.angle} ${offsetX} ${offsetY})`;

    return (
        <g data-selectable={1} id={props.uuid} transform={transformProperty}>
            <path
                style={{
                    fill: props.pattern.template !== null ? 'url(#pattern-' + props.pattern.template + '-' + props.uuid + '' : props.fill || "none ",
                    cursor: 'pointer',
                    stroke: props.pattern.offset ? props.fill : "black",
                    strokeWidth: props.border ? props.pattern.offset ? 20 : props.borderWidth / 5 + "mm" : 0,
                    strokeDasharray: props.pattern.offset ? null : props.borderStyle
                }}
                d={smoothPathC}
                id={props.uuid}
                data-transformable={1}
                data-selectable={1}
                clipPath={props.pattern.offset ? "url(#clip-" + props.uuid + ")" : null}
            />

            {props.pattern.offset && props.border &&
            <path
                id={"stroke-" + props.uuid}
                style={{
                    fill: "none",
                    strokeDasharray: props.borderStyle,
                    strokeWidth: props.borderWidth / 5 + "mm",
                    strokeLinecap: "butt",
                    stroke: "black"
                }}
                d={smoothPathC}
            />
            }

            {props.pattern.offset &&
            <clipPath id={"clip-" + props.uuid}>
                <path d={smoothPathC}/>
            </clipPath>
            }

            {!props.inPreview &&
            <path
                stroke={"rgba(100,100,100,0.0)"}
                strokeWidth={props.border ? 20 : 0}
                style={
                    {
                        fill: 'none', cursor: "pointer"
                    }
                }
                data-uuid={props.uuid}
                className={"no-print"}
                d={smoothPathC}
                data-transformable={1}
                data-selectable={1}
            />
            }

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