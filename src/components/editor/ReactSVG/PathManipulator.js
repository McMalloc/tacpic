import React from 'react'
// import './PathManipulator.scss';
import { buildPath } from "./PathGeneration";
import methods from "./methods/methods";
import styled from "styled-components/macro";
import { useDispatch } from 'react-redux';
import { SWITCH_CURSOR_MODE } from '../../../actions/action_constants';
import { TOOLS } from '../../../config/constants';

const transformView = (coords, scaleX, scaleY, x, y, viewPortX, viewPortY) => {
    return coords.map((coord, index) => {
        let transformed = coord;
        if (index % 2 === 0) { // horizontal / x
            transformed *= scaleX;
            transformed += x * scaleX + viewPortX;
        } else { // vertikal / y
            transformed *= scaleY;
            transformed += y * scaleY + viewPortY;
        }
        return transformed;
    });
};

const anchorSize = 8;
const Anchor = styled.circle`
  fill: ${props => props.selected ? 'pink' : 'white'};
  stroke-width: 3px;
  stroke: deeppink;
  
  &:hover {
    stroke-width: 5px;
  }
`;
const ControlAnchor = styled.rect`
  fill: ${props => props.selected ? 'pink' : 'white'};
  stroke-width: 2px;
  stroke: deeppink;
  
  &:hover {
    stroke-width: 4px;
  }
`;

const CoordLabel = props => {
    return <rect>
        <text></text>
    </rect>
}

// TODO Koordinaten entsprechend der Pfadtransformation mittransformieren
// TODO lineare Verbindung zwischen letztem Punkt und Cursorposition
const PathManipulator = props => {
    // TODO der Indikator wird gerade noch mittransformiert.
    //  wie Manipulator nicht mittransformieren, aber die einzelnen Koordinaten
    // const dispatch = useDispatch();
    if (!props.path || props.path.type !== "path") return null;

    let transformedPoints = props.path.points.map(point => {
        return {
            ...point, coords: transformView(
                point.coords, props.scale * props.path.scaleX, props.scale * props.path.scaleY, props.path.x, props.path.y, props.offsetX, props.offsetY)
        }
    });

    if (props.attachable) {
        transformedPoints = [transformedPoints[0], transformedPoints[transformedPoints.length - 1]];
    }

    let offsetX = 0;
    let offsetY = 0;
    if (props.angle !== 0) {
        let bbox = methods.path.getBBox(props.path);
        offsetX = bbox.width / 2 + bbox.x - props.path.x;
        offsetY = bbox.height / 2 + bbox.y - props.path.y;
    }

    return (
        <g>
            {!props.attachable &&
            <path
                stroke={"purple"}
                id={"PATH-INDICATOR"}
                strokeWidth={"1px"}
                fill={"none"}
                strokeLinecap={"butt"}
                d={buildPath(transformedPoints)}
            />
            }
            {transformedPoints.map((point, index) => {
                if (point.kind === "LF") return null; // don't draw freeform points
                switch (point.kind.toUpperCase()) {
                    case 'M':
                    case 'L':
                        return (
                            <React.Fragment key={index}>
                                <Anchor cx={point.coords[0]}
                                    cy={point.coords[1]}
                                    selected={props.editIndex === index}
                                    className={"translatable"}
                                    data-role={"EDIT-PATH"}
                                    data-endpoint={index === 0 || index === transformedPoints.length - 1}
                                    data-associated-path={props.path.uuid}
                                    data-index={index}
                                    onMouseDown={props.attachable && props.callbacks.onMouseDown}
                                    onMouseUp={props.attachable && props.callbacks.onMouseUp}
                                    data-param={0}
                                    key={index}
                                    r={anchorSize} />

                            </React.Fragment>

                        );
                    case 'C':
                        let previousSegment = transformedPoints[index - 1].coords;
                        let prevPointX = previousSegment[previousSegment.length - 2];
                        let prevPointY = previousSegment[previousSegment.length - 1];
                        return (
                            <g key={index}>
                                {!props.attachable && <>
                                    <line
                                        stroke={'black'}
                                        strokeWidth={0.5}
                                        x1={prevPointX + anchorSize / 2}
                                        y1={prevPointY + anchorSize / 2}
                                        x2={point.coords[0]}
                                        y2={point.coords[1]} />

                                    <line
                                        stroke={'black'}
                                        strokeWidth={0.5}
                                        x1={point.coords[4] + anchorSize / 2}
                                        y1={point.coords[5] + anchorSize / 2}
                                        x2={point.coords[2]}
                                        y2={point.coords[3]} />

                                    {/*{index !== 1 &&*/}

                                    <ControlAnchor
                                        x={point.coords[0] - anchorSize / 2}
                                        y={point.coords[1] - anchorSize / 2}
                                        className={"translatable"}
                                        data-role={"EDIT-PATH"}
                                        data-associated-path={props.path.uuid}
                                        data-index={index}
                                        data-param={0}
                                        width={anchorSize} height={anchorSize} />
                                    {/*}*/}

                                    <ControlAnchor
                                        x={point.coords[2] - anchorSize / 2}
                                        y={point.coords[3] - anchorSize / 2}
                                        className={"translatable"}
                                        data-role={"EDIT-PATH"}
                                        data-associated-path={props.path.uuid}
                                        data-index={index}
                                        data-param={2}
                                        width={anchorSize} height={anchorSize} />
                                </>}

                                <Anchor cx={point.coords[4]}
                                    cy={point.coords[5]}
                                    className={"translatable"}
                                    selected={props.editIndex === index}
                                    data-endpoint={index === 0 || index === transformedPoints.length - 1}
                                    data-role={"EDIT-PATH"}
                                    onMouseDown={props.attachable && props.callbacks.onMouseDown}
                                    onMouseUp={props.attachable && props.callbacks.onMouseUp}
                                    data-associated-path={props.path.uuid}
                                    data-index={index}
                                    data-param={4}
                                    r={anchorSize} />
                            </g>
                        );
                }
            })
            }
        </g>

    )
};

export default PathManipulator;