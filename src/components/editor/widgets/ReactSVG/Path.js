import React from 'react'
import transform from "./transform";
import './Path.css';

const buildPath = points => {
    return points.reduce((acc, point) => {
        // TODO filter out incomplete segment definitions to avoid svg syntax errors
        return acc + `${point.kind} ${point.coords.map(n => { return parseInt(n); }).join(" ")} `;
    }, "").replace(/\s\s/g, " ").trim();
};

export default function SVGPath(props) {
    return (
        <path
            stroke={"black"}
            transform={transform(props.x, props.y, props.angle)}
            fill={"rgba(30,255,50,0.3)"}
            id={props.uuid}
            d={buildPath(props.points)}
            data-transformable={1}
            data-selectable={1}
        />
    )
}