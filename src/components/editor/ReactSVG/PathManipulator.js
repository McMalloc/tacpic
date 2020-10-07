import React from 'react'
// import './PathManipulator.scss';
import {buildPath} from "./PathGeneration";
import methods from "./methods/methods";
import styled from "styled-components";

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
  fill: ${props=> props.selected ? 'pink' : 'white'};
  stroke-width: 3px;
  stroke: deeppink;
  
  &:hover {
    stroke-width: 5px;
  }
`;
const ControlAnchor = styled.rect`
  fill: ${props=> props.selected ? 'pink' : 'white'};
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
    if (!props.path || props.path.type !== "path") return null;

    let transformedPoints = props.path.points.map(point => {
        return {
            ...point, coords: transformView(
                point.coords, props.scale * props.path.scaleX, props.scale * props.path.scaleY, props.path.x, props.path.y, props.offsetX, props.offsetY)
        }
    });
    let offsetX = 0;
    let offsetY = 0;
    if (props.angle !== 0) {
        let bbox = methods.path.getBBox(props.path);
        offsetX = bbox.width / 2 + bbox.x - props.path.x;
        offsetY = bbox.height / 2 + bbox.y - props.path.y;
    }

    return (
        <g>
            <path
                stroke={"purple"}
                id={"PATH-INDICATOR"}
                strokeWidth={"1px"}
                fill={"none"}
                strokeLinecap={"butt"}
                d={buildPath(transformedPoints)}
            />
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
                                <line
                                    stroke={'black'}
                                    strokeWidth={0.5}
                                    x1={prevPointX + anchorSize / 2}
                                    y1={prevPointY + anchorSize / 2}
                                    x2={point.coords[0]}
                                    y2={point.coords[1]}/>

                                <line
                                    stroke={'black'}
                                    strokeWidth={0.5}
                                    x1={point.coords[4] + anchorSize / 2}
                                    y1={point.coords[5] + anchorSize / 2}
                                    x2={point.coords[2]}
                                    y2={point.coords[3]}/>

                                {/*{index !== 1 &&*/}
                                <ControlAnchor
                                    x={point.coords[0] - anchorSize/2}
                                    y={point.coords[1] - anchorSize/2}
                                    className={"translatable"}
                                    data-role={"EDIT-PATH"}
                                    data-associated-path={props.path.uuid}
                                    data-index={index}
                                    data-param={0}
                                    width={anchorSize} height={anchorSize}/>
                                {/*}*/}

                                <ControlAnchor
                                    x={point.coords[2] - anchorSize/2}
                                    y={point.coords[3] - anchorSize/2}
                                    className={"translatable"}
                                    data-role={"EDIT-PATH"}
                                    data-associated-path={props.path.uuid}
                                    data-index={index}
                                    data-param={2}
                                    width={anchorSize} height={anchorSize}/>

                                <Anchor cx={point.coords[4]}
                                        cy={point.coords[5]}
                                        className={"translatable"}
                                        selected={props.editIndex === index}
                                        data-endpoint={index === 0 || index === transformedPoints.length - 1}
                                        data-role={"EDIT-PATH"}
                                        data-associated-path={props.path.uuid}
                                        data-index={index}
                                        data-param={4}
                                        r={anchorSize} />
                            </g>
                        );

                    // return <><Anchor
                    //     key={index}
                    //     x={point.kind === 'C' ? point.coords[4] : point.coords[0] - anchorSize/2}
                    //     y={point.kind === 'C' ? point.coords[5] : point.coords[1] - anchorSize/2}
                    //     data-associated-path={props.path.uuid}
                    //     data-role={"EDIT-PATH"}
                    //     data-start={index === 0}
                    //     data-index={index} />
                    //     <text x={point.coords[0] + 5} fill={"blue"} fontSize={12}
                    //           y={point.coords[1] + 5}>{index}: {parseInt(point.coords[0])},{parseInt(point.coords[1])}</text> </>
                }
            })
            }
        </g>

    )
    /*
    return (
        <g>
            {this.props.path.points.map((point, index) => {
                let coords = transformView(
                    [...point.coords],
                    this.props.scale,
                    this.props.offsetX + this.props.path.x,
                    this.props.offsetY + this.props.path.y
                );
                switch (point.kind.toUpperCase()) {
                    case 'M':
                        return (
                            <circle
                                cx={coords[0]}
                                cy={coords[1]}
                                data-role={"CLOSE-PATH"}
                                data-index={index}
                                data-param={0}
                                key={index}
                                r={6}/>
                        );
                    case 'L':
                        return (
                            <rect x={coords[0] - 5}
                                  y={coords[1] - 5}
                                  className={"translatable"}
                                  data-role={"EDIT-PATH"}
                                  data-index={index}
                                  data-param={0}
                                  width={10} height={10}/>
                        );
                    case 'C':
                        let previousSegment = transformView(
                            [...this.props.path.points[index-1].coords],
                            this.props.scale,
                            this.props.offsetX + this.props.path.x,
                            this.props.offsetY + this.props.path.y
                        );
                        let prevPointX = previousSegment[previousSegment.length - 2];
                        let prevPointY = previousSegment[previousSegment.length - 1];
                        return (
                            <g key={index}>
                                <line
                                    stroke={'black'}
                                    strokeWidth={0.5}
                                    x1={prevPointX}
                                    y1={prevPointY}
                                    x2={coords[0]}
                                    y2={coords[1]}/>

                                <line
                                    stroke={'black'}
                                    strokeWidth={0.5}
                                    x1={coords[4]}
                                    y1={coords[5]}
                                    x2={coords[2]}
                                    y2={coords[3]}/>

                                {index !== 1 &&
                                <circle
                                    cx={coords[0]}
                                    cy={coords[1]}
                                    className={"translatable"}
                                    data-role={"EDIT-PATH"}
                                    data-index={index}
                                    data-param={0}
                                    r={4}/>
                                }

                                <circle
                                    cx={coords[2]}
                                    cy={coords[3]}
                                    className={"translatable"}
                                    data-role={"EDIT-PATH"}
                                    data-index={index}
                                    data-param={2}
                                    r={4}/>

                                <rect x={coords[4] - 5}
                                      y={coords[5] - 5}
                                      className={"translatable"}
                                      data-role={"EDIT-PATH"}
                                      data-index={index}
                                      data-param={4}
                                      width={10} height={10}/>
                            </g>
                        );
                    case 'Q':
                        return (
                            <g>
                                <circle onMouseDown={this.pointDragStart}
                                        onMouseUp={this.pointDragStop}
                                        data-role={"__path-vertex"}
                                        stroke={"darkblue"} fill={"none"}
                                        key={index}
                                        cx={(coords[2] || coords[0]) - 2}
                                        cy={(coords[3] || coords[1]) - 2} r={4}/>
                                }
                            </g>
                        );
                }
            })}

            }
        </g>
    );
    */
};

export default PathManipulator;