import React from 'react';
import './Grid.css';

// TODO laut react profiler große performance kosten
export default function SVGGrid(props) {
    let nVerticals = parseInt(props.canvasWidth / props.verticalGridSpacing) + 1;
    let verticals = new Array(nVerticals).fill(null).map((n, i) => {
        return <line x1={i * props.verticalGridSpacing + props.offsetX}
                     y1={0}
                     key={i}
                     className={"grid-line"}
                     x2={i * props.verticalGridSpacing + props.offsetX}
                     y2={props.canvasHeight}
                     strokeWidth={1}
                     stroke={'rgba(0,0,0,0.05)'}/>
    });
    let nHorizontals = parseInt(props.canvasHeight / props.horizontalGridSpacing) + 1;
    let horizontals = new Array(nHorizontals).fill(null).map((n, i) => {
        return <line x1={0}
                     y1={i * props.horizontalGridSpacing + props.offsetY}
                     className={"grid-line"}
                     x2={props.canvasWidth}
                     key={i}
                     y2={i * props.horizontalGridSpacing + props.offsetY}
                     strokeWidth={1}
                     stroke={'rgba(0,0,0,0.05)'}/>
    });
    return (
        <g role={"GRID"}>
            {verticals}
            {horizontals}
        </g>
    )
}