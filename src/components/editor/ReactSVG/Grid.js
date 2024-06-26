import React from 'react';
import {useSelector} from "react-redux";

// TODO laut react profiler große performance kosten
export default function SVGGrid(props) {
    const {
        showVerticalGrid,
        showHorizontalGrid
    } = useSelector(state => state.editor.file.present);

    let nVerticals = parseInt(props.canvasWidth / props.verticalGridSpacing) + 1;
    let verticals = new Array(nVerticals).fill(null).map((n, i) => {
        let x = parseInt((i * props.verticalGridSpacing)) + "mm";
        return <line x1={x} y1={0}
                     x2={x} y2={(props.canvasHeight) + "mm"}
                     key={i}
                     className={"grid-line"}
                     strokeWidth={1}
                     stroke={'rgba(0,0,0,0.05)'}/>
    });
    let nHorizontals = parseInt(props.canvasHeight / props.horizontalGridSpacing) + 1;
    let horizontals = new Array(nHorizontals).fill(null).map((n, i) => {
        let y = parseInt((i * props.horizontalGridSpacing)) + "mm";
        return <line x1={0} y1={y}
                     x2={props.canvasWidth + "mm"} y2={y}
                     className={"grid-line"}
                     key={i}
                     strokeWidth={1}
                     stroke={'rgba(0,0,0,0.05)'}/>
    });

    return (
        <g transform={`translate(${props.offsetX},${props.offsetY})`} role={"GRID"}>
            {showVerticalGrid && verticals}
            {showHorizontalGrid && horizontals}
        </g>
    )
}