import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {find} from "lodash";
import './PathManipulator.css';

const transformView = (coords, scale, offsetX, offsetY) => {
    return coords.map((coord, index) => {
        let transformed = coord;
        if (index % 2 === 0) { // horizontal / x
            transformed += offsetX;
        } else { // vertikal / y
            transformed += offsetY;
        }
        return transformed * scale;
    });
};

// TODO Koordinaten entsprechend der Pfadtransformation mittransformieren
// TODO lineare Verbindung zwischen letztem Punkt und Cursorposition
class PathManipulator extends Component {
    pointDragStart = event => {
        // event.stopPropagation();
    };

    pointDragStop = event => {
        event.stopPropagation();
    };

    // TODO der Indikator wird gerade noch mittransformiert.
    //  wie Manipulator nicht mittransformieren, aber die einzelnen Koordinaten
    render() {
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
    }
}

// TODO brauch keine Instanz sein
const mapStateToProps = (state, ownProps) => {
    return {
        // path: find(state.editor.file.pages[0].objects, {uuid: ownProps.uuid}),
        scale: state.editor.ui.scalingFactor,
        offsetX: state.editor.ui.viewPortX,
        offsetY: state.editor.ui.viewPortY
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePoint: () => {

        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PathManipulator);